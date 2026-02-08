const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
// Load .env.local if present (common for CRA projects), then fallback to .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '8mb' }));

const GROQ_KEY = process.env.GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY;
const baseEndpoint = process.env.REACT_APP_GROQ_ENDPOINT || 'https://api.groq.com/openai/v1';
// Ensure /chat/completions is appended (Groq uses OpenAI-compatible endpoint)
const GROQ_ENDPOINT = baseEndpoint.endsWith('/chat/completions') ? baseEndpoint : `${baseEndpoint}/chat/completions`;

console.log(`[Server] Endpoint: ${GROQ_ENDPOINT}`);
console.log(`[Server] API Key: ${GROQ_KEY ? GROQ_KEY.substring(0, 20) + '...' : 'NOT SET'}`);

if (!GROQ_KEY) {
  console.warn('Warning: REACT_APP_GROQ_API_KEY is not set. Proxy will return 401 for forwarded requests.');
}

/**
 * Fetch real news and sentiment data for an industry
 */
const fetchIndustryNews = async (industry, keywords) => {
  try {
    const newsApiKey = process.env.REACT_APP_NEWS_API_KEY;
    if (!newsApiKey) {
      console.log('[Market Data] NewsAPI key not set, skipping news fetch');
      return null;
    }

    const query = keywords.join(' OR ');
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: 5,
        apiKey: newsApiKey
      },
      timeout: 5000
    });

    if (response.data.articles && response.data.articles.length > 0) {
      return {
        news_count: response.data.articles.length,
        top_stories: response.data.articles.slice(0, 2).map(a => a.title),
        sentiment: response.data.articles[0].title.includes('growth') || response.data.articles[0].title.includes('surge') ? 'positive' : 'mixed'
      };
    }
  } catch (err) {
    console.log(`[Market Data] News fetch failed for ${industry}:`, err.message);
  }
  return null;
};

/**
 * Fetch market sentiment and trends from CoinGecko (free, no auth needed)
 */
const fetchGlobalMarketTrends = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/global', {
      timeout: 5000
    });
    
    const btcDominance = response.data.data?.btc_dominance;
    const marketCapChange = response.data.data?.market_cap_change_percentage_24h_usd;
    
    return {
      market_sentiment: marketCapChange > 0 ? 'bullish' : 'bearish',
      market_change_24h: `${marketCapChange?.toFixed(2)}%`,
      crypto_dominance: `${btcDominance?.toFixed(2)}%`
    };
  } catch (err) {
    console.log('[Market Data] Global market fetch failed:', err.message);
  }
  return null;
};

/**
 * Fetch market trend data from multiple sources (real-time + fallbacks)
 * This provides real-time market context for the AI analysis
 */
const fetchMarketTrendData = async (industry) => {
  try {
    // Define industry keywords and benchmarks
    const industryData = {
      saas: {
        keywords: ['saas', 'software as a service', 'cloud computing', 'subscription'],
        baseline: {
          trend: 'Growing',
          growth_rate: '12-15% YoY',
          key_indicators: ['ARR growth', 'Customer churn rate', 'NPS score'],
          current_focus: 'AI integration, cost optimization, vertical solutions',
          market_size: '$200B+ global SaaS market',
          relevant_benchmarks: 'Typical SaaS ARR growth: 20-30% for growth stage, CAC payback: 12-24 months'
        }
      },
      ecommerce: {
        keywords: ['e-commerce', 'retail', 'online shopping', 'digital commerce'],
        baseline: {
          trend: 'Recovering with AI personalization',
          growth_rate: '8-10% YoY',
          key_indicators: ['Conversion rate', 'AOV', 'Cart abandonment'],
          current_focus: 'AI recommendations, mobile optimization, direct-to-consumer',
          market_size: '$6T+ global e-commerce',
          relevant_benchmarks: 'Average conversion rate: 2-3%, AOV benchmarks vary by category (5-500 USD)'
        }
      },
      healthcare: {
        keywords: ['healthcare technology', 'digital health', 'healthtech', 'telemedicine'],
        baseline: {
          trend: 'Digital transformation accelerating',
          growth_rate: '15-18% YoY',
          key_indicators: ['User adoption', 'Regulatory compliance', 'Integration depth'],
          current_focus: 'Interoperability, data security, AI diagnostics',
          market_size: '$500B+ digital health market',
          relevant_benchmarks: 'Healthcare SaaS retention: 95%+, compliance (HIPAA/GDPR) critical'
        }
      },
      fintech: {
        keywords: ['fintech', 'financial technology', 'payments', 'blockchain'],
        baseline: {
          trend: 'Competitive, regulation-driven',
          growth_rate: '10-14% YoY',
          key_indicators: ['Transaction volume', 'AUM', 'Regulatory status'],
          current_focus: 'Blockchain integration, API-first, embedded finance',
          market_size: '$100B+ fintech investment 2024',
          relevant_benchmarks: 'Payment processing: 1-3% fee margins, crypto volatility high'
        }
      },
      manufacturing: {
        keywords: ['manufacturing', 'industry 4.0', 'IoT', 'industrial'],
        baseline: {
          trend: 'Industry 4.0 adoption',
          growth_rate: '6-9% YoY',
          key_indicators: ['Production yield', 'Equipment downtime', 'Supply chain efficiency'],
          current_focus: 'IoT sensors, predictive maintenance, digital twins',
          market_size: '$1.5T+ industrial IoT market',
          relevant_benchmarks: 'Implementation time: 12-24 months, ROI typically 2-3 years'
        }
      },
      telecom: {
        keywords: ['telecom', '5G', 'telecommunications', 'networks'],
        baseline: {
          trend: 'Consolidation and 5G expansion',
          growth_rate: '2-4% YoY',
          key_indicators: ['ARPU', 'Churn rate', '5G subscriber growth'],
          current_focus: '5G rollout, edge computing, network slicing',
          market_size: '$2T+ global telecom',
          relevant_benchmarks: '5G capex: $100B+ annually, network expansion 2-3 years'
        }
      },
      retail: {
        keywords: ['retail', 'retail technology', 'point of sale', 'inventory'],
        baseline: {
          trend: 'Omnichannel transformation',
          growth_rate: '5-8% YoY',
          key_indicators: ['Foot traffic', 'Inventory turnover', 'Customer lifetime value'],
          current_focus: 'Omnichannel experience, inventory optimization, sustainability',
          market_size: '$30T+ global retail',
          relevant_benchmarks: 'Retail NPS: 40-60, inventory carrying costs: 20-30% annually'
        }
      }
    };

    const industryLower = industry?.toLowerCase();
    const data = industryData[industryLower];
    
    if (!data) {
      return {
        trend: 'Dynamic market',
        growth_rate: '8-12% typical',
        key_indicators: ['Market fit', 'Competitive positioning', 'User adoption'],
        current_focus: 'Innovation, market differentiation',
        market_size: 'Industry-dependent',
        relevant_benchmarks: 'Varies by industry segment'
      };
    }

    // Start with baseline data
    const marketData = { ...data.baseline };

    // Fetch real news data in parallel (non-blocking, optional)
    const [newsData, globalTrends] = await Promise.all([
      fetchIndustryNews(industryLower, data.keywords),
      fetchGlobalMarketTrends()
    ]);

    // Enhance with real news data if available
    if (newsData) {
      marketData.recent_news = newsData.top_stories;
      marketData.sentiment_indicator = newsData.sentiment;
      console.log(`[Market Data] Enhanced ${industry} with real news data`);
    }

    // Enhance with global market trends if available
    if (globalTrends) {
      marketData.broader_market_sentiment = globalTrends.market_sentiment;
      marketData.market_change_24h = globalTrends.market_change_24h;
      console.log(`[Market Data] Enhanced with global market trends`);
    }

    return marketData;
  } catch (err) {
    console.error('Error fetching market trend data:', err);
    // Return safe baseline if everything fails
    return {
      trend: 'Dynamic market',
      growth_rate: '8-12% typical',
      key_indicators: ['Market fit', 'Competitive positioning', 'User adoption'],
      current_focus: 'Innovation, market differentiation',
      market_size: 'Industry-dependent',
      relevant_benchmarks: 'Varies by industry segment'
    };
  }
};

/**
 * Proxy endpoint for AI generation
 */
app.post('/api/generate', async (req, res) => {
  try {
    const payload = req.body;
    
    // Groq uses OpenAI-compatible format, but messages structure is simpler
    // Convert from Anthropic format (content array) to OpenAI format (string content)
    const groqPayload = {
      model: payload.model,
      max_tokens: 4096,
      messages: payload.messages.map(msg => ({
        role: msg.role,
        // If content is array (Anthropic format), extract text; otherwise use as-is
        content: Array.isArray(msg.content) 
          ? msg.content.find(c => c.type === 'text')?.text || JSON.stringify(msg.content)
          : msg.content
      }))
    };

    const resp = await axios.post(GROQ_ENDPOINT, groqPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY || ''}`
      },
      timeout: 120000
    });

    // Groq returns OpenAI format: { choices: [{ message: { content: "..." } }] }
    // Normalize to match expected format { content: [{ type: 'text', text: "..." }] }
    const normalizedResponse = {
      content: [
        { type: 'text', text: resp.data.choices[0].message.content }
      ]
    };

    return res.status(resp.status).json(normalizedResponse);
  } catch (err) {
    console.error('\n[Proxy Error]');
    console.error('Endpoint:', GROQ_ENDPOINT);
    console.error('Error message:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Response headers:', err.response.headers);
      console.error('Response body (first 500 chars):', JSON.stringify(err.response.data).substring(0, 500));
      return res.status(err.response.status).json({
        error: 'Upstream API error',
        status: err.response.status,
        details: typeof err.response.data === 'string' ? err.response.data.substring(0, 200) : err.response.data
      });
    }
    console.error('Full error:', err);
    return res.status(502).json({ error: 'Bad Gateway', message: err.message });
  }
});

/**
 * Endpoint to fetch market data for a specific industry
 * Returns real-time trend data to inform AI analysis
 */
app.post('/api/market-data', async (req, res) => {
  try {
    const { industry } = req.body;
    
    if (!industry) {
      return res.status(400).json({ error: 'Industry parameter required' });
    }
    
    const marketData = await fetchMarketTrendData(industry);
    
    return res.json({
      industry,
      timestamp: new Date().toISOString(),
      data: marketData
    });
  } catch (err) {
    console.error('Error in market data endpoint:', err);
    return res.status(500).json({ error: 'Failed to fetch market data', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on http://localhost:${PORT}`);
});

import { API_CONFIG } from '../constants';
import { getMediaType } from '../utils/fileUtils';

/**
 * Build the prompt for scenario generation
 * @param {Object} formData - Form input data
 * @param {boolean} hasFile - Whether a file was uploaded
 * @param {number} timeframe - Number of months
 * @param {string} industry - Industry name
 * @param {Object} marketData - Real-time market data (optional)
 * @returns {string} Formatted prompt
 */
const buildPrompt = (formData, hasFile, timeframe, industry, marketData) => {
  const basePrompt = hasFile
    ? `You are a strategic product simulation AI. I've uploaded a product document that contains details about my product.

Based on the uploaded document and the following information, generate 5 divergent future scenarios for a product management decision.`
    : `You are a strategic product simulation AI. Generate 5 divergent future scenarios for a product management decision.`;

  const userChallenge = formData.productType || formData.decision;
  
  // Include market context if available (real-time data)
  let marketContext = '';
  if (marketData && marketData.data) {
    const d = marketData.data;
    marketContext = `

CURRENT MARKET CONTEXT FOR ${industry.toUpperCase()}:
- Market Trend: ${d.trend}
- Growth Rate: ${d.growth_rate}
- Key Indicators to Monitor: ${d.key_indicators.join(', ')}
- Current Market Focus: ${d.current_focus}
- Market Size: ${d.market_size}
- Industry Benchmarks: ${d.relevant_benchmarks}`;
    
    // Add real-time enhancements if available
    if (d.recent_news) {
      marketContext += `
- Recent News: ${d.recent_news.slice(0, 2).join(' | ')}`;
    }
    if (d.sentiment_indicator) {
      marketContext += `
- News Sentiment: ${d.sentiment_indicator}`;
    }
    if (d.broader_market_sentiment) {
      marketContext += `
- Broader Market Sentiment: ${d.broader_market_sentiment}`;
    }
    if (d.market_change_24h) {
      marketContext += `
- 24h Market Change: ${d.market_change_24h}`;
    }
  }

  return `${basePrompt}

USER'S CHALLENGE: ${userChallenge}

CRITICAL DECISION TO MAKE: ${formData.decision}
INDUSTRY: ${industry}
TIMEFRAME: ${timeframe} months
ADDITIONAL CONTEXT: ${formData.context}${marketContext}


Generate exactly 5 scenarios representing different decision paths (for example: Aggressive Growth, Measured Growth, Hold/Wait, Pivot, Defensive). For each scenario, provide a month-by-month timeline.

For each scenario include these additional fields: "brainstorming" (an array of short tactical ideas), "marketSizing" (one-line market sizing summary), "customerNeeds" (array of top customer needs), and "reasoning" (a short explanation why this decision path leads to the described outcome). In every scenario's "reasoning" explicitly reference the provided DECISION and explain how that decision interacts with the scenario's path.

At the top level of the JSON response include a "recommendation" object with the fields: { "scenarioName": "<name of the scenario you recommend>", "justification": "short justification that references the DECISION and any public benchmarks or general market reasoning used to reach this conclusion" }.

Return your response as a valid JSON object with this exact structure:
{
  "scenarios": [
    {
      "name": "Aggressive Growth",
      "description": "brief description",
      "outcome": "overall outcome summary",
      "probability": "percentage",
      "brainstorming": ["idea 1", "idea 2"],
      "marketSizing": "TAM/SAM summary",
      "customerNeeds": ["need 1", "need 2"],
      "reasoning": "short rationale",
      "timeline": [
        {
          "month": 1,
          "events": ["event 1", "event 2"],
          "metrics": {
            "revenue": "+15%",
            "userGrowth": "+25%",
            "nps": "72",
            "marketShare": "+3%"
          },
          "risks": ["risk 1", "risk 2"],
          "regulatoryStatus": "green|yellow|red"
        }
      ]
    }
  ]
}

Make the scenarios realistic and specific to ${industry}. Include regulatory considerations for each month. Make metrics quantitative. Ensure timeline has ${timeframe} months.${hasFile ? ' Base your scenarios on the product details from the uploaded document.' : ''}

In your reasoning and in the top-level recommendation, reference public benchmarks or common industry heuristics where relevant (e.g., SaaS benchmarks for churn/ARR growth, e-commerce conversion rates, typical NPS ranges) and clearly state any assumptions. Provide short citations or mention common sources (e.g., "benchmark: typical SaaS ARR growth ~20%/yr (public benchmarks)") when used. End with a single-line final recommendation object explaining which scenario to choose relative to the DECISION and why.
`;
};

/**
 * Build message content for API request
 * @param {Object} params - Parameters object
 * @returns {Array} Message content array
 */
const buildMessageContent = ({ formData, uploadedFile, fileContent, timeframe, industry, marketData }) => {
  const messageContent = [];

  // Add file if uploaded
  if (uploadedFile && fileContent) {
    messageContent.push({
      type: "document",
      source: {
        type: "base64",
        media_type: getMediaType(uploadedFile),
        data: fileContent
      }
    });
  }

  // Add text prompt with market data
  messageContent.push({
    type: "text",
    text: buildPrompt(formData, !!uploadedFile, timeframe, industry, marketData)
  });

  return messageContent;
};

/**
 * Fetch real-time market data for the specified industry
 * @param {string} industry - Industry name
 * @returns {Promise<Object>} Market data object
 */
const fetchMarketData = async (industry) => {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/api/market-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ industry })
    });
    
    if (!response.ok) {
      console.warn(`Market data fetch failed: ${response.status}`);
      return null;
    }
    
    return await response.json();
  } catch (err) {
    console.warn('Could not fetch real-time market data:', err.message);
    return null;
  }
};

/**
 * Get the correct API URL based on environment
 * Handles localhost, Codespaces, and other environments
 */
const getApiUrl = () => {
  // For Codespaces or environments with a custom API URL
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // In browser context
  if (typeof window !== 'undefined' && window.location) {
    const protocol = window.location.protocol; // http: or https:
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // If we're on localhost with a port, always use port 4000 with same protocol
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//localhost:4000`;
    }
    
    // For Codespaces: hostname pattern is like "codespace-name-3000.preview.app.github.dev"
    // We need to replace the current port (3000) with 4000
    if (hostname.includes('github.dev') || hostname.includes('codespaces')) {
      // Replace current port number with 4000
      // Match pattern like "-3000." and replace with "-4000."
      const codespaceUrl = hostname.replace(/-\d+\./, '-4000.');
      return `${protocol}//${codespaceUrl}`;
    }
    
    // Fallback: use same hostname with port 4000
    return `${protocol}//${hostname}:4000`;
  }

  // Server-side or fallback
  return 'http://localhost:4000';
};

/**
 * Parse AI response and extract scenarios
 * @param {Object} data - API response data
 * @returns {Array|null} Scenarios array or null
 */
const parseAIResponse = (data) => {
  try {
    // Handle both direct text and content array format
    let content = '';
    
    if (typeof data === 'string') {
      content = data;
    } else if (data.content && Array.isArray(data.content)) {
      const textContent = data.content.find(c => c.type === 'text' || c.text);
      content = textContent?.text || textContent || '';
    } else if (data.text) {
      content = data.text;
    }
    
    if (!content) {
      console.error('No text content found in API response. Response structure:', JSON.stringify(data).substring(0, 500));
      return null;
    }

    console.log('[parseAIResponse] Content preview:', content.substring(0, 200));

    // Extract JSON from response - be more aggressive with extraction
    // Look for JSON object that contains "scenarios"
    let jsonMatch = null;
    
    // Try to find the last JSON object (most likely to be complete)
    const allMatches = content.match(/\{[\s\S]*?\}/g);
    if (allMatches && allMatches.length > 0) {
      // Find the largest object that contains "scenarios"
      jsonMatch = allMatches.reverse().find(match => match.includes('"scenarios"'));
    }
    
    if (!jsonMatch) {
      // Fallback: try last complete object
      jsonMatch = content.match(/\{[\s\S]*\}$/);
    }
    
    if (!jsonMatch) {
      // Last resort: find largest JSON object
      jsonMatch = content.match(/\{[\s\S]*\}/);
    }
    
    if (!jsonMatch) {
      console.error('No JSON found in response. Content preview:', content.substring(0, 500));
      return null;
    }

    console.log('[parseAIResponse] Attempting to parse JSON of length:', jsonMatch.length);

    try {
      const parsed = JSON.parse(jsonMatch);
      const scenarios = parsed.scenarios || [];
      
      if (!Array.isArray(scenarios) || scenarios.length === 0) {
        console.error('No scenarios array in parsed response or empty array. Parsed keys:', Object.keys(parsed));
        return null;
      }

      console.log('[parseAIResponse] Found', scenarios.length, 'scenarios');

      const recommendation = parsed.recommendation || null;

      // Normalize scenarios to ensure fields exist and annotate recommendation
      const normalized = scenarios.map(s => ({
        name: s.name || 'Unnamed Scenario',
        description: s.description || '',
        outcome: s.outcome || '',
        probability: s.probability || '',
        brainstorming: Array.isArray(s.brainstorming) ? s.brainstorming : (s.brainstorming ? [s.brainstorming] : []),
        marketSizing: s.marketSizing || '',
        customerNeeds: Array.isArray(s.customerNeeds) ? s.customerNeeds : (s.customerNeeds ? [s.customerNeeds] : []),
        reasoning: s.reasoning || '',
        timeline: Array.isArray(s.timeline) ? s.timeline : [],
        recommended: false,
        recommendationJustification: ''
      }));

      if (recommendation && recommendation.scenarioName) {
        const match = normalized.find(n => n.name.toLowerCase().trim() === recommendation.scenarioName.toLowerCase().trim());
        if (match) {
          match.recommended = true;
          match.recommendationJustification = recommendation.justification || '';
        }
      }

      console.log('[parseAIResponse] Successfully parsed scenarios');
      return normalized;
    } catch (jsonErr) {
      console.error('Failed to parse JSON from extracted content:', jsonErr.message);
      console.error('Attempted JSON length:', jsonMatch.length);
      console.error('Attempted JSON preview:', jsonMatch.substring(0, 500));
      return null;
    }
  } catch (err) {
    console.error('Error in parseAIResponse:', err);
    return null;
  }
};

/**
 * Generate scenarios using AI API with market data
 * @param {Object} params - Generation parameters
 * @returns {Promise<Array>} Array of scenarios
 */
export const generateScenarios = async (params) => {
  // Always use the proxy server for API calls (CORS-safe)
  const target = `${getApiUrl()}/api/generate`;

  let marketData = null;
  
  // Fetch market data in parallel (optional, won't block if it fails)
  try {
    marketData = await fetchMarketData(params.industry);
  } catch (err) {
    // Market data fetch failed, but we can continue without it
    console.warn('Market data not available, continuing without:', err.message);
  }

  // Build message content with market data
  const messageContent = buildMessageContent({
    ...params,
    marketData
  });

  let response;
  try {
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        max_tokens: API_CONFIG.maxTokens,
        messages: [{
          role: 'user',
          content: messageContent
        }]
      })
    };

    // API key is handled by the proxy server for security,
    // so we don't include it in the client-side request

    console.log('[generateScenarios] Sending request to:', target);
    response = await fetch(target, init);
  } catch (err) {
    // Network-level error (DNS, connection, CORS, etc.)
    console.error('Fetch error details:', err);
    console.error('Failed to reach API at:', target);
    throw new Error(`Network error while contacting AI service: ${err.message}\n\nAPI URL: ${target}\n\nMake sure the backend server is running on port 4000: npm run start:server`);
  }

  if (!response.ok) {
    // Try to get body for more context
    let bodyText = '';
    try { bodyText = await response.text(); } catch (_) {}
    
    console.error('[generateScenarios] API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      body: bodyText
    });
    
    if (response.status === 401 || response.status === 403) {
      throw new Error(`API authentication failed. Please check your GROQ_API_KEY in the server environment.`);
    }
    
    throw new Error(`API request failed: ${response.status} ${response.statusText}\n\n${bodyText}`);
  }

  const data = await response.json();
  console.log('[generateScenarios] Received API response');
  const scenarios = parseAIResponse(data);

  if (!scenarios) {
    console.error('Failed to parse scenarios. API response data:', JSON.stringify(data).substring(0, 2000));
    throw new Error('Failed to parse scenarios from AI response. Check browser console for details. The AI may not have returned properly formatted scenario data.');
  }

  return scenarios;
};

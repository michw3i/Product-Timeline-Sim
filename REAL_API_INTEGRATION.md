# Real-Time Market Data API Integration

## Overview

Your Product Timeline Simulator now fetches **real-time market data** from external APIs to provide contextually relevant product release recommendations. The system intelligently combines real news sentiment, global market trends, and industry benchmarks.

## ✅ What's New

### 1. **Real Market Sentiment** (from CoinGecko - No Auth Required)
- ✅ Real-time global market sentiment (Bullish/Bearish)
- ✅ 24-hour market change percentage
- ✅ Crypto dominance metrics

**Why this matters:** Market sentiment affects investor confidence and product launch timing decisions.

### 2. **Real Industry News** (from NewsAPI - Optional)
- ✅ Latest news headlines for your industry
- ✅ News sentiment analysis (positive/mixed/negative)
- ✅ Appears in AI prompt to inform scenario generation

**Why this matters:** Recent news can indicate emerging trends and market opportunities.

### 3. **Fallback System** (Built-in Resilience)
- ✅ If APIs are slow or unavailable, system uses curated baseline data
- ✅ Scenarios still generate perfectly without real-time data
- ✅ No errors or broken features if APIs fail

## 🔌 API Integrations

### CoinGecko (Free Market Data)
- **Endpoint:** `https://api.coingecko.com/api/v3/global`
- **Authentication:** None (completely free)
- **Rate Limit:** 10-50 calls/minute (more than enough)
- **What we fetch:**
  - Global market sentiment
  - Bitcoin dominance
  - 24h market change

### NewsAPI (Optional Real News)
- **Endpoint:** `https://newsapi.org/v2/everything`
- **Authentication:** API Key (free tier available)
- **Rate Limit:** 100 requests/day (free tier)
- **What we fetch:**
  - Latest industry news
  - News headlines
  - Sentiment indicators

**Get your free NewsAPI key:**
1. Go to https://newsapi.org/
2. Click "Get API Key" 
3. Sign up (free)
4. Copy your key
5. Add to `.env.local`: `REACT_APP_NEWS_API_KEY=your_key_here`

## 📊 How It Works

### Data Flow
```
User Input (Industry + Decision)
    ↓
Fetch Real Market Data (Parallel)
    ├─ CoinGecko (Global Sentiment) ✅ Always works
    └─ NewsAPI (Industry News) ⚠️ Optional
    ↓
Enhance AI Prompt with Real Data
    ├─ Market sentiment
    ├─ Recent news
    ├─ Industry benchmarks
    └─ Growth trends
    ↓
Generate 5 AI Scenarios (More Contextual!)
    ↓
Display Timeline with Recommendations
```

### Example: SaaS Product Release
**Before (Hardcoded):**
- "SaaS market growing at 12-15% YoY"

**After (With Real Data):**
- "SaaS market growing at 12-15% YoY"
- **+ Global market is bullish (+1.31% in 24h)**
- **+ Recent headlines: "AI companies see 45% funding increase", "SaaS consolidation accelerates"**
- **+ News sentiment is positive**

This context makes the AI's 5 scenarios much more relevant to **current market conditions**.

## 🚀 Getting Started

### Option 1: Use Without NewsAPI (Quickest)
Works immediately with real global sentiment:
```bash
npm run start:server  # Backend with CoinGecko integration
npm start            # Frontend
# Both ready to go - just use the app!
```

### Option 2: Add NewsAPI for Even Better Results
1. **Get free NewsAPI key:**
   - Visit https://newsapi.org/
   - Sign up and copy your API key

2. **Add to .env.local:**
   ```
   REACT_APP_NEWS_API_KEY=your_newsapi_key_here
   ```

3. **Restart backend:**
   ```bash
   pkill -f "node server"
   npm run start:server
   ```

4. **Check it's working:**
   ```bash
   curl http://localhost:4000/api/market-data -X POST \
     -H "Content-Type: application/json" \
     -d '{"industry":"saas"}' | grep "recent_news"
   ```

## 🔧 Configuration

### Backend Server Logs
When the server starts, you'll see:
```
[Server] Endpoint: https://api.groq.com/openai/v1/chat/completions
[Server] API Key: gsk_noIoP6UL...
Proxy server listening on http://localhost:4000
```

### Market Data Fetching Logs
```
[Market Data] Enhanced saas with real news data
[Market Data] Enhanced with global market trends
```

### If APIs Fail (Graceful Fallback)
```
[Market Data] News fetch failed for saas: Request timeout
  → Continues with baseline data ✅
```

## 📈 What Gets Passed to AI

### Example Response to `/api/market-data` with NewsAPI Key:
```json
{
  "industry": "saas",
  "timestamp": "2026-02-08T08:12:03.802Z",
  "data": {
    "trend": "Growing",
    "growth_rate": "12-15% YoY",
    "key_indicators": ["ARR growth", "Customer churn rate", "NPS score"],
    "current_focus": "AI integration, cost optimization, vertical solutions",
    "market_size": "$200B+ global SaaS market",
    "relevant_benchmarks": "Typical SaaS ARR growth: 20-30% for growth stage...",
    
    "recent_news": [
      "AI funding surges in SaaS sector",
      "Enterprise SaaS adoption hits record highs"
    ],
    "sentiment_indicator": "positive",
    "broader_market_sentiment": "bullish",
    "market_change_24h": "1.31%"
  }
}
```

This entire context is fed to the AI, making scenarios more realistic and timely.

## 🎯 Supported Industries

All 7 industries now get real-time enhancements:
- **SaaS** - AI integration, cost optimization focus
- **E-commerce** - AI personalization, mobile optimization
- **Healthcare** - Digital transformation, regulatory compliance
- **FinTech** - Blockchain, API-first, embedded finance
- **Manufacturing** - Industry 4.0, IoT sensors
- **Telecom** - 5G rollout, edge computing
- **Retail** - Omnichannel, inventory optimization

## 🛡️ Security & Best Practices

### API Keys
- ✅ NewsAPI key stored in `.env.local` (backend only)
- ✅ Never exposed to the frontend
- ✅ CoinGecko requires no authentication

### Rate Limits
- ✅ CoinGecko: 10-50 calls/min (we use 1 per request)
- ✅ NewsAPI: 100/day free (we use 1 per request)
- ✅ Groq: 10,000/month (you already have this)

### Timeouts
- ✅ API calls have 5-second timeouts
- ✅ If slow, system falls back to baseline data
- ✅ Never blocks scenario generation

## 🔄 Future Enhancements

These APIs could be added for even richer data:

### Stock Market Data
```
Alpha Vantage (https://www.alphavantage.co/)
- Real stock prices for industry leaders
- Sector performance indices
- Free tier: 5 calls/min
```

### Company-Specific Data
```
Finnhub (https://finnhub.io/)
- Specific company metrics
- Competitor analysis
- Earnings data
```

### Economic Indicators
```
Trading Economics (https://tradingeconomics.com/api/)
- GDP growth rates
- Interest rates
- Inflation data
```

### Sector Performance
```
Yahoo Finance (yfinance Python package)
- Sector ETF performance
- Industry specific trends
```

## 🧪 Testing

### Check if Market Data Endpoint Works
```bash
curl http://localhost:4000/api/market-data -X POST \
  -H "Content-Type: application/json" \
  -d '{"industry":"fintech"}' | jq .
```

### Check if NewsAPI Integration Works
```bash
curl http://localhost:4000/api/market-data -X POST \
  -H "Content-Type: application/json" \
  -d '{"industry":"healthcare"}' | jq '.data.recent_news'
```

### Real Example Scenarios Generated
When you use the app with these real APIs:
1. **Input:** "Should I release my SaaS product now or in Q2?"
2. **Industry:** SaaS
3. **System fetches:**
   - ✅ SaaS growth benchmarks (12-15% YoY)
   - ✅ Real market sentiment (bullish today)
   - ✅ Latest SaaS news headlines
4. **AI generates 5 scenarios** with this context
5. **Output:** Realistic timelines based on current market conditions

## ❓ FAQ

**Q: Do I need NewsAPI to use this?**
A: No! CoinGecko data (free, no auth) + hardcoded benchmarks work perfectly. NewsAPI just adds real news headlines.

**Q: Will slow APIs delay my scenario generation?**
A: No! All API calls have 5-second timeouts and fail gracefully to hardcoded data.

**Q: Can I use different API keys per industry?**
A: Not currently, but you could extend the backend to support it. All industries use the same APIs.

**Q: Are my API keys safe?**
A: Yes! They're only on the backend server. React frontend never sees them.

**Q: What if an API goes down?**
A: System automatically uses fallback baseline data. No errors, scenarios still generate.

## 📚 Resources

- [CoinGecko API Docs](https://www.coingecko.com/en/api/documentation)
- [NewsAPI Docs](https://newsapi.org/docs)
- [Groq API Docs](https://console.groq.com/docs)
- [Axios Docs](https://axios-http.com/)

---

**Your Product Timeline Simulator now has real-time market awareness!** 🚀

The AI analyzes current trends, recent news, and market sentiment to give product managers data-driven guidance on **when** to release their products.

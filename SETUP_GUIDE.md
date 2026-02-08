# Product Timeline Simulator - Setup Guide

## Quick Start

### Prerequisites
- Node.js (v14+)
- A free Groq API key

### Step 1: Get Your Groq API Key

1. Go to [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up for a free account
3. Generate a new API key
4. Grab your API key (free tier: 10,000 requests/month)

### Step 2: Configure Environment

```bash
# Copy and configure the environment file
cp .env.local.example .env.local

# Edit .env.local and add your Groq API key
REACT_APP_GROQ_API_KEY=your_api_key_here
REACT_APP_USE_PROXY=true
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Run the Application (Two Terminal Windows)

**Terminal 1 - Start the Backend Proxy Server:**
```bash
npm run start:server
```
You should see: `Proxy server listening on http://localhost:4000`

**Terminal 2 - Start the React Frontend:**
```bash
npm start
```
This opens the app at http://localhost:3000

## How It Works

### Architecture
1. **Frontend (React)** - Collects user input and displays timeline results
2. **Backend Proxy Server (Express)** - Securely handles API calls and market data
3. **AI Service (Groq)** - Generates product release scenarios
4. **Market Data Service** - Provides real-time industry insights

### Key Features

#### 1. **Market-Aware AI Analysis**
The system now fetches real-time market trends for the selected industry and includes them in the AI analysis. This helps provide contextually relevant recommendations.

**Supported Industries:**
- SaaS (12-15% YoY growth, ARR benchmarks)
- E-commerce (8-10% YoY growth, conversion rate metrics)
- Healthcare (15-18% YoY growth, regulatory compliance focus)
- FinTech (10-14% YoY growth, blockchain/regulations)
- Manufacturing (6-9% YoY growth, IoT/Industry 4.0)
- Telecom (2-4% YoY growth, 5G expansion)
- Retail (5-8% YoY growth, omnichannel)

#### 2. **Scenario Generation**
Input your product decision (e.g., "Should I release this product now or later?") and the AI generates:
- 5 divergent scenario paths (Aggressive Growth, Measured Growth, Hold/Wait, Pivot, Defensive)
- Month-by-month timeline with specific events
- Quantitative metrics (revenue %, user growth, NPS, market share)
- Risk assessments and regulatory status
- Brainstorming ideas for each scenario

#### 3. **Secure API Communication**
- Your API key stays on the backend server
- Frontend makes requests to the local proxy server (port 4000)
- No CORS issues, no key leaks

## Features Explanation

### For Product Managers

Use this tool to answer critical product decisions like:

- **Release Timing** - "Should I release now or wait for Q3?"
- **Feature Prioritization** - "Should I build X or Y feature first?"
- **Market Entry** - "Is this the right time to enter this market?"
- **Scaling Decisions** - "Should I go aggressive in growth or measured?"

### Process
1. **Input Your Decision** - Describe the strategic question
2. **Specify Your Product Type** - Select industry or specify custom
3. **Choose Timeframe** - 3 months to 36 months
4. **Optional: Upload Documentation** - Include product docs for context
5. **Click Analyze** - AI generates personalized scenarios
6. **Review Recommendation** - AI highlights the recommended path with justification

### Timeline View
The results are displayed in an interactive timeline showing:
- Key milestones and events for each scenario
- Month-by-month progression
- Color-coded risk levels (green/yellow/red)
- Quantitative metrics tracking
- Regulatory compliance status

## Troubleshooting

### Error: "Network error while contacting AI service: Failed to fetch"

**Solution 1:** Make sure the backend server is running
```bash
npm run start:server
# Should show: "Proxy server listening on http://localhost:4000"
```

**Solution 2:** Check your Groq API key
```bash
# Verify .env.local has your actual API key (not empty)
cat .env.local | grep REACT_APP_GROQ_API_KEY
```

**Solution 3:** Check the backend console for errors
```bash
# Look for auth errors or API endpoint issues
# The backend will log all requests and errors
```

### Error: "API authentication failed"

Your Groq API key is missing or invalid:
1. Go to [https://console.groq.com/keys](https://console.groq.com/keys)
2. Generate a new key
3. Update .env.local with the new key
4. Restart the backend server: `npm run start:server`

### Error: "Connection refused on port 4000"

The backend server isn't running:
```bash
# In a separate terminal, run:
npm run start:server
```

### Market data won't load?

Market data is optional - scenarios will still generate without it. Check the network tab to see if `/api/market-data` calls are succeeding.

## Development

### File Structure
```
/
├── src/
│   ├── services/aiService.js      # AI and market data integration
│   ├── hooks/                      # React hooks for forms and file upload
│   ├── components/                 # React components
│   ├── utils/                      # Utility functions
│   └── styles/                     # CSS styling
├── server/
│   └── index.js                    # Backend proxy & market data API
├── .env.local.example              # Environment template
└── package.json                    # Dependencies
```

### Backend API Endpoints

#### POST /api/generate
Forwards requests to Groq API with secure key handling.

**Request:**
```json
{
  "model": "llama-3.3-70b-versatile",
  "max_tokens": 4000,
  "messages": [{ "role": "user", "content": [...] }]
}
```

**Response:** Normalized API response with scenarios JSON

#### POST /api/market-data
Provides industry-specific market intelligence.

**Request:**
```json
{ "industry": "saas" }
```

**Response:**
```json
{
  "industry": "saas",
  "timestamp": "2026-02-08T...",
  "data": {
    "trend": "Growing",
    "growth_rate": "12-15% YoY",
    "key_indicators": [...],
    "current_focus": "...",
    "market_size": "...",
    "relevant_benchmarks": "..."
  }
}
```

## Future Enhancements

Potential additions to make the tool even more powerful:

1. **Real Stock Market Integration** - Fetch actual stock prices and trends via APIs like Alpha Vantage
2. **Company-Specific Data** - Input your company's metrics and compare to benchmarks
3. **Competitor Analysis** - Auto-analyze competitor movements and strategies
4. **Scenario Sharing** - Export and share scenarios with your team
5. **Historical Analysis** - Compare past predictions with actual outcomes
6. **Custom Metrics** - Define industry-specific metrics to track
7. **Collaborative Planning** - Invite team members to comment and iterate

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review the backend server logs for detailed error messages
3. Verify your Groq API key is valid at [https://console.groq.com](https://console.groq.com)

---

**Happy planning!** 🚀

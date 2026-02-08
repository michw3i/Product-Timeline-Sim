export const INDUSTRIES = [
  { value: 'saas', label: 'SaaS' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'fintech', label: 'FinTech' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'telecom', label: 'Telecom' },
  { value: 'retail', label: 'Retail' },
  { value: 'custom', label: 'Custom (specify below)' }
];

export const TIMEFRAMES = [
  { value: '3', label: '3 Months' },
  { value: '6', label: '6 Months' },
  { value: '9', label: '9 Months' },
  { value: '12', label: '12 Months' },
  { value: '18', label: '18 Months' },
  { value: '24', label: '24 Months' },
  { value: 'custom', label: 'Custom (specify below)' }
];

export const REGULATORY_COLORS = {
  green: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  yellow: 'bg-amber-100 text-amber-700 border-amber-300',
  red: 'bg-red-100 text-red-700 border-red-300'
};

export const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx';

export const MAX_TIMEFRAME_MONTHS = 36;

export const API_CONFIG = {
  // Prefer environment variables so keys are not checked into source.
  // Using Groq API (free tier, no payment required)
  endpoint: process.env.REACT_APP_GROQ_ENDPOINT ? `${process.env.REACT_APP_GROQ_ENDPOINT}/chat/completions` : 'https://api.groq.com/openai/v1/chat/completions',
  model: process.env.REACT_APP_GROQ_MODEL || 'llama-3.3-70b-versatile',
  maxTokens: parseInt(process.env.REACT_APP_MAX_TOKENS || '4000', 10)
};

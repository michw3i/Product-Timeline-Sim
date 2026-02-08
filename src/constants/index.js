export const INDUSTRIES = [
  { value: 'fintech', label: 'FinTech' },
  { value: 'banking', label: 'Banking' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'payments', label: 'Payments' },
  { value: 'lending', label: 'Lending' },
  { value: 'wealth-management', label: 'Wealth Management' },
  { value: 'regtech', label: 'RegTech' },
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
  green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  yellow: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30'
};

export const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx';

export const MAX_TIMEFRAME_MONTHS = 36;

export const API_CONFIG = {
  endpoint: 'https://api.anthropic.com/v1/messages',
  model: 'claude-sonnet-4-20250514',
  maxTokens: 4000
};

import { API_CONFIG } from '../constants';
import { getMediaType } from '../utils/fileUtils';

/**
 * Build the prompt for scenario generation
 * @param {Object} formData - Form input data
 * @param {boolean} hasFile - Whether a file was uploaded
 * @param {number} timeframe - Number of months
 * @param {string} industry - Industry name
 * @returns {string} Formatted prompt
 */
const buildPrompt = (formData, hasFile, timeframe, industry) => {
  const basePrompt = hasFile
    ? `You are a strategic product simulation AI. I've uploaded a product document that contains details about my product.

Based on the uploaded document and the following information, generate 3 divergent future scenarios for a product management decision.`
    : `You are a strategic product simulation AI. Generate 3 divergent future scenarios for a product management decision.`;

  return `${basePrompt}

DECISION: ${formData.decision}
PRODUCT TYPE: ${hasFile ? 'From uploaded document' : formData.productType}
INDUSTRY: ${industry}
TIMEFRAME: ${timeframe} months
ADDITIONAL CONTEXT: ${formData.context}

Generate exactly 3 scenarios: Optimistic, Realistic, and Pessimistic. For each scenario, provide a month-by-month timeline.

Return your response as a valid JSON object with this exact structure:
{
  "scenarios": [
    {
      "name": "Optimistic Path",
      "description": "brief description",
      "outcome": "overall outcome summary",
      "probability": "percentage",
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

Make the scenarios realistic and specific to ${industry}. Include regulatory considerations for each month. Make metrics quantitative. Ensure timeline has ${timeframe} months.${hasFile ? ' Base your scenarios on the product details from the uploaded document.' : ''}`;
};

/**
 * Build message content for API request
 * @param {Object} params - Parameters object
 * @returns {Array} Message content array
 */
const buildMessageContent = ({ formData, uploadedFile, fileContent, timeframe, industry }) => {
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

  // Add text prompt
  messageContent.push({
    type: "text",
    text: buildPrompt(formData, !!uploadedFile, timeframe, industry)
  });

  return messageContent;
};

/**
 * Parse AI response and extract scenarios
 * @param {Object} data - API response data
 * @returns {Array|null} Scenarios array or null
 */
const parseAIResponse = (data) => {
  const content = data.content.find(c => c.type === 'text')?.text || '';
  
  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.scenarios || null;
  }
  
  return null;
};

/**
 * Generate scenarios using Claude API
 * @param {Object} params - Generation parameters
 * @returns {Promise<Array>} Array of scenarios
 */
export const generateScenarios = async (params) => {
  const messageContent = buildMessageContent(params);

  const response = await fetch(API_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: API_CONFIG.model,
      max_tokens: API_CONFIG.maxTokens,
      messages: [{
        role: 'user',
        content: messageContent
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  const scenarios = parseAIResponse(data);

  if (!scenarios) {
    throw new Error('Failed to parse scenarios from AI response');
  }

  return scenarios;
};

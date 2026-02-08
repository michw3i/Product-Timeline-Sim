/**
 * Generate mock scenarios for demo/fallback
 * @param {number} timeframe - Number of months
 * @returns {Array} Array of scenario objects
 */
export const generateMockScenarios = (timeframe) => {
  return [
    {
      name: "Optimistic Path",
      description: "Market conditions align perfectly, early adoption exceeds expectations",
      outcome: "Dominant market position established with strong regulatory compliance",
      probability: "25%",
      reasoning: "Aggressive early investment plus viral growth drives outsized adoption and market momentum.",
      brainstorming: [
        "Prioritize viral onboarding loops to accelerate early adoption",
        "Partner with two enterprise customers for credibility",
        "Introduce premium features after product-market fit"
      ],
      marketSizing: "TAM estimated at $2.4B with a reachable SAM of $480M in the first 24 months",
      customerNeeds: [
        "Simple onboarding and low-friction payments",
        "Robust data-export and reporting",
        "Dedicated onboarding support for enterprise customers"
      ],
      timeline: Array.from({ length: timeframe }, (_, i) => ({
        month: i + 1,
        events: [
          i === 0 ? "Product launch successful" : `Month ${i + 1} milestone achieved`,
          "Positive user feedback"
        ],
        metrics: {
          revenue: `+${15 + i * 5}%`,
          userGrowth: `+${20 + i * 8}%`,
          nps: `${65 + i * 2}`,
          marketShare: `+${2 + i}%`
        },
        risks: ["Minor technical debt", "Scaling challenges"],
        regulatoryStatus: "green"
      }))
    },
    {
      name: "Realistic Path",
      description: "Steady growth with expected challenges and competitive pressure",
      outcome: "Stable market position with moderate growth trajectory",
      probability: "50%",
      reasoning: "Measured investment and iterative learning lead to stable growth while managing risk.",
      brainstorming: [
        "Focus on retention: build lightweight referral incentives",
        "Invest in analytics to identify high-value cohorts",
        "Run localized pilots in 2 regions before full roll-out"
      ],
      marketSizing: "TAM ~$1.8B with initial SAM of $300M for target segments",
      customerNeeds: [
        "Clear pricing tiers",
        "Reliable performance at scale",
        "Transparent privacy and compliance controls"
      ],
      timeline: Array.from({ length: timeframe }, (_, i) => ({
        month: i + 1,
        events: [
          i === 0 ? "Soft launch with limited scope" : `Incremental progress`,
          "Mixed customer feedback"
        ],
        metrics: {
          revenue: `+${8 + i * 2}%`,
          userGrowth: `+${10 + i * 3}%`,
          nps: `${55 + i}`,
          marketShare: `+${1 + i * 0.5}%`
        },
        risks: ["Budget constraints", "Competitor moves"],
        regulatoryStatus: "yellow"
      }))
    },
    {
      name: "Pessimistic Path",
      description: "Unexpected headwinds, regulatory scrutiny, and market resistance",
      outcome: "Pivot required or strategic retreat from initial vision",
      probability: "25%",
      reasoning: "Regulatory and market headwinds limit options, forcing conservative actions or pivots.",
      brainstorming: [
        "Explore narrower niche positioning to reduce regulatory exposure",
        "Delay large marketing spends until compliance risks are mitigated",
        "Consider partnerships to share compliance burden with established players"
      ],
      marketSizing: "Constrained near-term TAM due to regulation; runway-focused SAM of $80M",
      customerNeeds: [
        "Explicit compliance guarantees",
        "Low-risk deployment options",
        "Clear escalation paths for support"
      ],
      timeline: Array.from({ length: timeframe }, (_, i) => ({
        month: i + 1,
        events: [
          i === 0 ? "Launch delayed due to compliance" : `Setback in month ${i + 1}`,
          "User adoption below target"
        ],
        metrics: {
          revenue: `-${2 + i}%`,
          userGrowth: `+${2 + i}%`,
          nps: `${45 - i}`,
          marketShare: `-${1 + i * 0.3}%`
        },
        risks: ["Regulatory investigation", "Team attrition", "Technical failures"],
        regulatoryStatus: "red"
      }))
    }
  ];
};

/**
 * Export scenario to text format
 * @param {Object} scenario - The scenario object
 * @param {Object} formData - The original form data
 * @returns {string} Formatted text
 */
export const exportScenarioToText = (scenario, formData) => {
  return `
PRODUCT MULTIVERSE SIMULATION
==============================

Decision: ${formData.decision}
Scenario: ${scenario.name}
Probability: ${scenario.probability}

${scenario.description}

OUTCOME: ${scenario.outcome}

${scenario.brainstorming ? 'BRAINSTORMING:\n- ' + scenario.brainstorming.join('\n- ') + '\n\n' : ''}${scenario.marketSizing ? 'MARKET SIZING:\n' + scenario.marketSizing + '\n\n' : ''}${scenario.customerNeeds ? 'CUSTOMER NEEDS:\n- ' + scenario.customerNeeds.join('\n- ') + '\n\n' : ''}
TIMELINE:
${scenario.timeline.map(m => `
Month ${m.month}:
- Events: ${m.events.join(', ')}
- Revenue: ${m.metrics.revenue}
- User Growth: ${m.metrics.userGrowth}
- NPS: ${m.metrics.nps}
- Market Share: ${m.metrics.marketShare}
- Regulatory Status: ${m.regulatoryStatus.toUpperCase()}
- Risks: ${m.risks.join(', ')}
`).join('\n')}
  `.trim();
};

/**
 * Download text file
 * @param {string} content - File content
 * @param {string} filename - File name
 */
export const downloadTextFile = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const LTV_DEFAULT_ASSUMPTION_TEXT =
  'Crestline customer LTV is $4,800 over 24 months based on mid-market fashion ecommerce benchmarks. Annualised contact volume is 65,000 (10,000 contacts in the 8-week period × 6.5). Dissatisfied contacts (CSAT below 3) are 18% of volume = 11,700 annually. Churn rate for dissatisfied customers is 38%. Dissatisfied revenue at risk = 11,700 × 38% × $4,800 = $21.3M (primary segment). Repeat contact waste and unresolved escalation premium are allocated proportionally. Coaching-protected LTV and CSAT recovery value offset a portion of total risk. Recalculate to update all figures from your assumptions.'

export const RISK_LINES = [
  {
    key: 'dissatisfiedRisk',
    annualKey: 'dissatisfiedRiskAnnual',
    dotColor: '#c0392b',
    title: 'Dissatisfied Contacts (CSAT < 3)',
    label: '18% of contacts below CSAT 3 · churn risk',
    legendLabel: 'Dissatisfied revenue at risk',
    body:
      'Customers rating their experience below 3 are significantly more likely to churn. At Crestline\'s $4,800 24-month LTV, dissatisfied contacts represent the largest retention exposure on returns and refund drivers.',
  },
  {
    key: 'repeatRisk',
    annualKey: 'repeatRiskAnnual',
    dotColor: '#d9534f',
    title: 'Repeat Contacts',
    label: '23% repeat contact rate · handle waste',
    legendLabel: 'Repeat contact waste',
    body:
      'Customers contacting support multiple times on the same issue show elevated churn risk. Returns and refund drivers drive the majority of repeat contacts in this period.',
  },
  {
    key: 'unresolvedRisk',
    annualKey: 'unresolvedRiskAnnual',
    dotColor: '#e8806f',
    title: 'Unresolved Escalations',
    label: 'Escalation premium on unresolved cases',
    legendLabel: 'Unresolved escalation premium',
    body:
      'Contacts escalated without timely resolution carry additional handle cost and higher churn probability than first-contact resolutions.',
  },
]

export const PROTECTED_LINES = [
  {
    key: 'coachingProtected',
    annualKey: 'coachingProtectedAnnual',
    title: 'Coaching-Protected LTV',
    label: 'Returns FCR +22pts W5 to W8 · formal coaching on four agents',
    legendLabel: 'Coaching-protected LTV',
    dotColor: '#1a7a4a',
    body:
      'Formal coaching on four flagged returns agents recovered first-contact resolution and reduced repeat contacts - protecting customer relationships and LTV.',
  },
  {
    key: 'csatProtected',
    annualKey: 'csatProtectedAnnual',
    title: 'CSAT Recovery Value',
    label: 'Partial CSAT rebound W6-W8 post-coaching',
    legendLabel: 'CSAT recovery value',
    dotColor: '#228b5a',
    body:
      'Customer satisfaction partially recovered in W6-W8 as returns handling improved. Further coaching can close the gap to the 4.2 target.',
  },
]

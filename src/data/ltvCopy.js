export const LTV_DEFAULT_ASSUMPTION_TEXT =
  'Crestline customer LTV is $4,800 over 24 months based on mid-market fashion ecommerce benchmarks. Annualised contact volume is 14,300 (2,200 contacts in the 8-week period × 6.5). Dissatisfied contacts (CSAT below 3) are 18% of volume = 2,574 annually. Churn rate for dissatisfied customers is 38%. Dissatisfied revenue at risk = 2,574 × 38% × $4,800 = $4.69M. Repeat contact waste $180K and unresolved escalation premium $290K bring total annualised revenue at risk to $5.16M. Coaching-protected LTV $1.8M and CSAT recovery value $950K total $2.75M protected annually. All figures are estimates.'

export const RISK_LINES = [
  {
    key: 'dissatisfiedRisk',
    annualKey: 'dissatisfiedRiskAnnual',
    title: 'Dissatisfied Contacts (CSAT < 3)',
    label: '2,574 annually · 18% of 14,300 contacts · 38% churn risk',
    description:
      'Customers rating their experience below 3 are significantly more likely to churn. At Crestline\'s $4,800 24-month LTV, dissatisfied contacts represent the largest retention exposure on the queue.',
    legendLabel: 'Dissatisfied contacts',
    dotColor: '#c0392b',
  },
  {
    key: 'repeatRisk',
    annualKey: 'repeatRiskAnnual',
    title: 'Repeat Contacts',
    label: 'Repeat contact waste · $180K annualised',
    description:
      'Customers contacting support multiple times on the same issue show elevated churn risk. The Returns & Refunds queue drives the majority of repeat contacts in this period.',
    legendLabel: 'Repeat contacts',
    dotColor: '#d9534f',
  },
  {
    key: 'unresolvedRisk',
    annualKey: 'unresolvedRiskAnnual',
    title: 'Unresolved Escalations',
    label: 'Unresolved escalation premium · $290K annualised',
    description:
      'Contacts ending without first-contact resolution or with unnecessary escalation carry a retention premium beyond the dissatisfied-contact baseline.',
    legendLabel: 'Unresolved contacts',
    dotColor: '#e8806f',
  },
]

export const PROTECTED_LINES = [
  {
    key: 'coachingProtected',
    annualKey: 'coachingProtectedAnnual',
    title: 'Coaching-Protected LTV',
    label: 'Returns FCR +22pts W5 to W8 · formal coaching on four agents',
    description:
      'Formal coaching on four flagged returns agents recovered first-contact resolution and reduced repeat contacts - protecting customer relationships and LTV.',
    legendLabel: 'Coaching-protected LTV',
    dotColor: '#1a7a4a',
  },
  {
    key: 'csatProtected',
    annualKey: 'csatProtectedAnnual',
    title: 'CSAT Recovery Value',
    label: 'CSAT partial recovery W6-W8 post-intervention',
    description:
      'Customer satisfaction partially recovered in W6-W8 as returns handling improved. Further coaching can close the gap to the 4.2 target.',
    legendLabel: 'CSAT recovery',
    dotColor: '#228b5a',
  },
]

import derivedKpis from './derivedKpis.json'

export const DERIVED_KPIS = derivedKpis
export const SOURCE_KPIS = derivedKpis.sources

export const ACTUAL_AHT = derivedKpis.overall.aht
export const REPEAT_CONTACTS = derivedKpis.overall.repeatContacts
export const UNNECESSARY_ESCALATIONS = derivedKpis.overall.unnecessaryEscalations
export const PAYMENT_CONTACTS = 0
export const MERCHANT_CHURN_PROXY = 0
export const PERIOD_WEEKS = 8

export const FCR = derivedKpis.overall.fcr
export const CSAT = derivedKpis.overall.csat
export const ESC_RATE = derivedKpis.overall.esc
export const TR_RATE = derivedKpis.overall.tr
export const RCR_RATE = derivedKpis.overall.rcr
export const ER_TARGET = 5
export const TR_TARGET = 8
export const RCR_TARGET = 12

export const DEFAULTS = {
  targetAht: 270,
  costPerMin: 0.35,
  escMultiplier: 1.5,
  weeklyCalls: 1250,
}

export const WK8 = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
export const WK5 = WK8

export const TREND = derivedKpis.trend

export const CROSS_KPI_PATTERNS = [
  {
    id: 'exec-ckp-1',
    accent: 'red',
    label: 'Cross-KPI Pattern 1',
    headline: 'Returns documentation gaps drive repeat contacts and CSAT decline',
    body: 'Agents closing returns and refund contacts without confirmation or case notes are generating a 31% repeat contact rate on Billing & Payments drivers - nearly triple Service Delivery. Documentation Accuracy and Resolution & Close are the two lowest-scoring quality pillars.',
  },
  {
    id: 'exec-ckp-2',
    accent: 'red',
    label: 'Cross-KPI Pattern 2',
    headline: 'Policy misquotes on returns window create critical failures',
    body: 'Multiple agents quoted a 14-day return window when Crestline policy is 30 days. These policy misquotes cluster in weeks 1–4 and map directly to critical failure flags and CSAT scores below 3.',
  },
  {
    id: 'exec-ckp-3',
    accent: 'green',
    label: 'Cross-KPI Pattern 3',
    headline: 'Formal coaching at W5 breaks the returns performance slide',
    body: 'Four agents flagged after 7+ consecutive days of micro coaching on unresolved refund confirmations received formal TL-led sessions in week 5. Returns-driver FCR moved from 37% at W5 to 59% by W8; micro coaching frequency on those agents dropped sharply.',
  },
  {
    id: 'exec-ckp-4',
    accent: 'amber',
    label: 'Cross-KPI Pattern 4',
    headline: 'Agent variance on returns handling is real and coachable',
    body: 'Returns-driver FCR ranges from above 80% for top performers to below 40% for struggling agents on the same drivers. Post-coaching improvement on the four flagged agents validates that structured intervention - not driver reassignment - is the lever.',
  },
]

export const LIVE_LABEL = 'Live · May 2026'
export const CALLS_PILL = '10,000 contacts analysed · 8 weeks'

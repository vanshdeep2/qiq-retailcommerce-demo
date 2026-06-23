export const ACTUAL_AHT = 348
export const REPEAT_CONTACTS = 506
export const UNNECESSARY_ESCALATIONS = 202
export const PAYMENT_CONTACTS = 0
export const MERCHANT_CHURN_PROXY = 0
export const PERIOD_WEEKS = 8

export const FCR = 61.0
export const CSAT = 3.6
export const ESC_RATE = 9.2
export const TR_RATE = 14.1
export const RCR_RATE = 23.0
export const ER_TARGET = 5
export const TR_TARGET = 8
export const RCR_TARGET = 12

export const DEFAULTS = {
  targetAht: 270,
  costPerMin: 0.35,
  escMultiplier: 1.5,
  weeklyCalls: 275,
}

export const WK8 = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
export const WK5 = WK8

export const TREND = {
  aht: [362, 375, 384, 387, 386, 337, 333, 336],
  fcr: [48.7, 58.9, 58.2, 57.8, 58.5, 71.6, 68.4, 65.8],
  esc: [7.2, 8.1, 9.0, 9.8, 10.2, 9.0, 8.5, 8.2],
  csat: [3.59, 3.49, 3.44, 3.44, 3.33, 3.61, 3.59, 3.59],
  tr: [11.2, 12.5, 13.8, 14.5, 15.0, 13.2, 12.8, 12.0],
  rcr: [18.5, 20.2, 22.1, 24.0, 25.5, 22.0, 20.5, 19.0],
}

export const DRIVER_ROWS = [
  { name: 'Return window / refund policy', volume: 312, share: 14.2, fcr: 42, aht: 468, esc: 12.5 },
  { name: 'Refund status not confirmed', volume: 248, share: 11.3, fcr: 38, aht: 452, esc: 11.2 },
  { name: 'Sizing exchange request', volume: 186, share: 8.5, fcr: 55, aht: 398, esc: 8.4 },
  { name: 'Delayed shipment', volume: 164, share: 7.5, fcr: 68, aht: 325, esc: 6.2 },
  { name: 'Wrong item received', volume: 142, share: 6.5, fcr: 48, aht: 441, esc: 10.8 },
]

export const CROSS_KPI_PATTERNS = [
  {
    label: 'Cross-KPI Pattern 1',
    headline: 'Returns documentation gaps drive repeat contacts and CSAT decline',
    body: 'Agents closing returns calls without refund confirmation or case notes are generating a 37% repeat contact rate on the Returns & Refunds queue - nearly triple the Order & Delivery queue. Documentation Accuracy and Resolution & Close are the two lowest-scoring quality pillars on returns contacts.',
  },
  {
    label: 'Cross-KPI Pattern 2',
    headline: 'Policy misquotes on returns window create critical failures',
    body: 'Multiple agents quoted a 14-day return window when Crestline policy is 30 days. These policy misquotes cluster in weeks 1–4 and map directly to critical failure flags and CSAT scores below 3.',
  },
  {
    label: 'Cross-KPI Pattern 3',
    headline: 'Formal coaching at W5 breaks the returns performance slide',
    body: 'Four agents flagged after 7+ consecutive days of micro coaching on unresolved refund confirmations received formal TL-led sessions in week 5. Returns queue FCR moved from 37% at W5 to 59% by W8; micro coaching frequency on those agents dropped sharply.',
  },
  {
    label: 'Cross-KPI Pattern 4',
    headline: 'Agent variance on returns handling is real and coachable',
    body: 'Returns FCR ranges from above 80% for top performers to below 40% for struggling agents on the same queue. Post-coaching improvement on the four flagged agents validates that structured intervention - not queue reassignment - is the lever.',
  },
]

export const LIVE_LABEL = 'Live · May 2026'
export const CALLS_PILL = '2,200 contacts analysed · 8 weeks'

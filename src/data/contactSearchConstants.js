import { FLAGGED_CALLS } from './teamleadConstants'

export const Q_NAMES = {
  q1: 'Resolution',
  q2: 'Diagnosis',
  q3: 'Efficiency',
  q4: 'Verification',
  q5: 'Escalation',
  q6: 'Expectation Setting',
  q7: 'Communication',
  q8: 'Callback',
  q9: 'Resolution & Close',
  q10: 'Customer Appreciation',
  q11: 'Documentation Accuracy',
  q12: 'Internal Process',
  q13: 'Business Policy',
  q14: 'Compliance',
}

export const PASS_FAIL_QS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q11']

export const AGENT_SLUGS = {
  'Michael Naidoo': 'michael-naidoo',
  'Nomsa Dlamini': 'nomsa-dlamini',
  'Lerato Nkosi': 'lerato-nkosi',
  'Pieter Botha': 'pieter-botha',
  'Busisiwe Maseko': 'busisiwe-maseko',
  'Ayanda Mbeki': 'ayanda-mbeki',
  'Zanele Ndlovu': 'zanele-ndlovu',
  'Thabo van der Merwe': 'thabo-van-der-merwe',
  'Janine Jacobs': 'janine-jacobs',
  'Sipho Khumalo': 'sipho-khumalo',
}

export const DEFAULT_FILTERS = {
  agent: 'all',
  category: 'all',
  dateFrom: '2026-04-06',
  dateTo: '2026-05-31',
  scoreFilter: 'all',
  criticalOnly: false,
  textSearch: '',
  week: 'all',
  resolution: 'all',
}

export const WEEK_BOUNDARIES = [
  { start: '2026-04-06', end: '2026-04-12', label: 'W1' },
  { start: '2026-04-13', end: '2026-04-19', label: 'W2' },
  { start: '2026-04-20', end: '2026-04-26', label: 'W3' },
  { start: '2026-04-27', end: '2026-05-03', label: 'W4' },
  { start: '2026-05-04', end: '2026-05-10', label: 'W5' },
  { start: '2026-05-11', end: '2026-05-17', label: 'W6' },
  { start: '2026-05-18', end: '2026-05-24', label: 'W7' },
  { start: '2026-05-25', end: '2026-05-31', label: 'W8' },
]

export const CF_QUICK_LINKS = FLAGGED_CALLS.filter((c) => c.callId.startsWith('CL-RX-CF')).map((c) => ({
  callId: c.callId,
  agent: c.agent,
  label: c.callId,
}))

export const SORTABLE_FIELDS = ['call_id', 'agent_name', 'call_date', 'call_category', 'qa_score']

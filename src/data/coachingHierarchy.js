export const CCM_ROLLUP = {
  name: 'Naledi Khumalo',
  role: 'CCM / Operations Director',
  deployed: 236,
  takenUp: 173,
  inProgress: 36,
  notTouched: 9,
}

export const COACHING_TLS = [
  {
    id: 'kagiso',
    name: 'Kagiso de Villiers',
    team: 'Returns & Refunds',
    deployed: 142,
    takenUp: 108,
    inProgress: 24,
    notTouched: 4,
    agents: [
      { name: 'Lerato Nkosi', micro: 'Twice weekly', formal: 'Completed W5', formalClass: 'badge-green' },
      { name: 'Pieter Botha', micro: 'None W6+', formal: 'Completed W5', formalClass: 'badge-green' },
      { name: 'Busisiwe Maseko', micro: 'Weekly', formal: 'In progress', formalClass: 'badge-amber' },
      { name: 'Ayanda Mbeki', micro: 'None W7+', formal: 'Completed W5', formalClass: 'badge-green' },
      { name: 'Zanele Ndlovu', micro: 'Daily', formal: 'Follow-up W9', formalClass: 'badge-red' },
      { name: 'Michael Naidoo', micro: 'None', formal: 'Benchmark', formalClass: 'badge-navy' },
      { name: 'Nomsa Dlamini', micro: 'Weekly', formal: 'Micro W4', formalClass: 'badge-green' },
      { name: 'Thabo van der Merwe', micro: 'Bi-weekly', formal: 'Workflow W5', formalClass: 'badge-green' },
      { name: 'Janine Jacobs', micro: 'Weekly', formal: 'Process W6', formalClass: 'badge-amber' },
      { name: 'Sipho Khumalo', micro: 'Daily', formal: 'Onboarding W3', formalClass: 'badge-green' },
    ],
  },
  {
    id: 'thandi',
    name: 'Thandi Mokoena',
    team: 'Order & Delivery',
    deployed: 52,
    takenUp: 38,
    inProgress: 8,
    notTouched: 3,
    agents: [
      { name: 'Andile Zulu', micro: 'None', formal: 'None', formalClass: 'badge-navy' },
      { name: 'Bongani Ngcobo', micro: 'Bi-weekly', formal: 'Shipping W6', formalClass: 'badge-green' },
      { name: 'Candice Pretorius', micro: 'Weekly', formal: 'In progress', formalClass: 'badge-amber' },
      { name: 'Dumisani Mthembu', micro: 'None', formal: 'Completed W5', formalClass: 'badge-green' },
    ],
  },
  {
    id: 'sarah',
    name: 'Sarah van der Berg',
    team: 'General Enquiries',
    deployed: 42,
    takenUp: 27,
    inProgress: 4,
    notTouched: 2,
    agents: [
      { name: 'Elize Steyn', micro: 'Monthly', formal: 'None', formalClass: 'badge-navy' },
      { name: 'Fikile Xaba', micro: 'Weekly', formal: 'Policy W7', formalClass: 'badge-green' },
      { name: 'Gugu Mhlongo', micro: 'None', formal: 'In progress', formalClass: 'badge-amber' },
      { name: 'Hendrik Kruger', micro: 'Bi-weekly', formal: 'Completed W6', formalClass: 'badge-green' },
    ],
  },
]

export const COACHING_HEALTH_SUMMARY = [
  { label: 'Deployed', value: '236', valueClass: '', sub: 'Formal + micro sessions generated' },
  { label: 'Taken up', value: '173', valueClass: 'val-green', sub: '73% of deployed' },
  { label: 'In progress', value: '36', valueClass: 'val-amber', sub: '15% of deployed' },
  { label: 'Not touched', value: '9', valueClass: 'val-red', sub: '4% of deployed' },
]

export const TEAM_HEALTH_STATS = [
  { label: 'Team QA Score', value: '78.4', valueClass: 'val-amber', sub: 'Avg quality score · Week 8' },
  { label: 'Critical Failures', value: '9', valueClass: 'val-amber', sub: 'This week · Down from 27 in week 4' },
  { label: 'Agents Improving', value: '7/10', valueClass: 'val-green', sub: 'Returns FCR up vs week 1' },
  { label: 'TL Action Required', value: '2', valueClass: 'val-amber', sub: 'Formal coaching follow-ups open' },
]

export const MATRIX_ROWS = [
  { slug: 'michael-naidoo', name: 'Michael Naidoo', qaW5: 94.2, qaW1: 93.8, delta: 0.4, deltaClass: 'delta-pos', pa: '92.0%', rr: '84.0%', topic: 'Benchmark', status: 'Benchmark', badgeClass: 'badge-navy' },
  { slug: 'nomsa-dlamini', name: 'Nomsa Dlamini', qaW5: 86.5, qaW1: 72.1, delta: 14.4, deltaClass: 'delta-pos', pa: '78.0%', rr: '71.0%', topic: 'Documentation Accuracy', status: 'On Track', badgeClass: 'badge-green' },
  { slug: 'lerato-nkosi', name: 'Lerato Nkosi', qaW5: 88.0, qaW1: 58.3, delta: 29.7, deltaClass: 'delta-pos', pa: '82.0%', rr: '82.0%', topic: 'Refund Confirmation', status: 'On Track', badgeClass: 'badge-green' },
  { slug: 'pieter-botha', name: 'Pieter Botha', qaW5: 87.2, qaW1: 61.5, delta: 25.7, deltaClass: 'delta-pos', pa: '85.0%', rr: '79.0%', topic: 'Returns Policy Accuracy', status: 'On Track', badgeClass: 'badge-green' },
  { slug: 'busisiwe-maseko', name: 'Busisiwe Maseko', qaW5: 79.8, qaW1: 64.2, delta: 15.6, deltaClass: 'delta-pos', pa: '68.0%', rr: '58.0%', topic: 'Resolution & Close', status: 'Watch', badgeClass: 'badge-amber' },
  { slug: 'ayanda-mbeki', name: 'Ayanda Mbeki', qaW5: 85.5, qaW1: 55.0, delta: 30.5, deltaClass: 'delta-pos', pa: '80.0%', rr: '78.0%', topic: 'Identity Verification', status: 'On Track', badgeClass: 'badge-green' },
  { slug: 'zanele-ndlovu', name: 'Zanele Ndlovu', qaW5: 68.5, qaW1: 71.2, delta: -2.7, deltaClass: 'delta-neg', pa: '42.0%', rr: '34.0%', topic: 'Escalation Criteria', status: 'Action Needed', badgeClass: 'badge-red' },
  { slug: 'thabo-van-der-merwe', name: 'Thabo van der Merwe', qaW5: 82.0, qaW1: 76.5, delta: 5.5, deltaClass: 'delta-pos', pa: '74.0%', rr: '68.0%', topic: 'Handle Efficiency', status: 'On Track', badgeClass: 'badge-green' },
  { slug: 'janine-jacobs', name: 'Janine Jacobs', qaW5: 77.5, qaW1: 70.8, delta: 6.7, deltaClass: 'delta-pos', pa: '65.0%', rr: '62.0%', topic: 'Partial Refund Workflow', status: 'Watch', badgeClass: 'badge-amber' },
  { slug: 'sipho-khumalo', name: 'Sipho Khumalo', qaW5: 75.0, qaW1: 68.2, delta: 6.8, deltaClass: 'delta-pos', pa: '60.0%', rr: '55.0%', topic: 'Returns Onboarding', status: 'On Track', badgeClass: 'badge-green' },
]

export const ALERT_AGENTS = [
  {
    slug: 'zanele-ndlovu',
    name: 'Zanele Ndlovu',
    status: 'Action Needed',
    badgeClass: 'badge-red',
    metrics: 'Returns FCR: 34% · PA: 42% · CF total: 3 · RCR: 28%',
    insight: 'Three critical failures in W1-W4 including escalation avoidance leading to third contacts. Returns FCR remains below 40% despite micro coaching.',
    action: 'Second formal coaching session on escalation criteria. Pair with Michael Naidoo for returns call shadowing. Target: FCR above 55% within 3 weeks.',
  },
  {
    slug: 'busisiwe-maseko',
    name: 'Busisiwe Maseko',
    status: 'Watch',
    badgeClass: 'badge-amber',
    metrics: 'Returns FCR: 58% · PA: 68% · CF total: 1 · RCR: 22%',
    insight: 'Formal coaching at W5 improved resolution confirmation but documentation accuracy gaps persist on repeat contacts.',
    action: 'Continue formal coaching check-ins weekly. Focus on case notes before close. Target: documentation pillar above 75%.',
  },
  {
    slug: 'lerato-nkosi',
    name: 'Lerato Nkosi',
    status: 'On Track',
    badgeClass: 'badge-green',
    metrics: 'Returns FCR: 82% · PA: 82% · CF total: 0 · RCR: 12%',
    insight: 'Strong post-coaching recovery after W5 formal session. Micro coaching triggers down from daily to twice weekly.',
    action: 'Maintain current trajectory. Consider for peer coaching support role on refund confirmation protocol.',
  },
  {
    slug: 'ayanda-mbeki',
    name: 'Ayanda Mbeki',
    status: 'On Track',
    badgeClass: 'badge-green',
    metrics: 'Returns FCR: 78% · PA: 80% · CF total: 0 · RCR: 14%',
    insight: 'Verification compliance improved dramatically after W5 formal coaching. Returns handling now above team average.',
    action: 'Share verification workflow with Sipho Khumalo in peer session.',
  },
]

export const MICRO_COACHING_QUEUE = [
  { agent: 'Lerato Nkosi', topic: 'Refund confirmation on close', trigger: 'QiQ · 3 calls today without refund timeline', date: 'Today', status: 'Acknowledged', badgeClass: 'badge-green', outcome: 'Down from daily triggers - formal coaching holding' },
  { agent: 'Pieter Botha', topic: 'Returns window accuracy', trigger: 'QiQ · Policy card review', date: 'Today', status: 'Completed', badgeClass: 'badge-green', outcome: 'Zero misquotes this week' },
  { agent: 'Busisiwe Maseko', topic: 'Case notes before close', trigger: 'QiQ · 2 contacts closed without documentation', date: 'Today', status: 'New', badgeClass: 'badge-amber', outcome: 'Micro nudge sent - awaiting acknowledgement' },
  { agent: 'Ayanda Mbeki', topic: 'Identity verification on returns', trigger: 'QiQ · Verification checklist', date: 'Yesterday', status: 'Completed', badgeClass: 'badge-green', outcome: '100% verification pass rate this week' },
  { agent: 'Zanele Ndlovu', topic: 'Escalation criteria met', trigger: 'QiQ · 2 contacts should have escalated', date: 'Today', status: 'New', badgeClass: 'badge-red', outcome: 'Third micro trigger this week - TL review' },
  { agent: 'Sipho Khumalo', topic: 'Return window confirmation', trigger: 'QiQ · Confirm 30-day policy verbally', date: 'Today', status: 'In Progress', badgeClass: 'badge-amber', outcome: 'Improving - 2 of 5 calls met standard' },
  { agent: 'Nomsa Dlamini', topic: 'Documentation on repeat contacts', trigger: 'QiQ · Link prior case before resolving', date: 'Yesterday', status: 'Completed', badgeClass: 'badge-green', outcome: 'Repeat contacts down 8% this week' },
  { agent: 'Janine Jacobs', topic: 'Partial refund calculation', trigger: 'QiQ · Use refund calculator tool', date: 'Today', status: 'In Progress', badgeClass: 'badge-amber', outcome: 'Early improvement on dispute calls' },
]

export const MICRO_COACHING_SUMMARY = [
  { text: '8 micro sessions today', className: 'summary-chip' },
  { text: '4 completed', className: 'summary-chip summary-chip-green' },
  { text: '3 in progress', className: 'summary-chip summary-chip-amber' },
  { text: '1 TL escalation', className: 'summary-chip summary-chip-amber' },
]

export const COACHING_QUEUE = [
  { agent: 'Lerato Nkosi', topic: 'Refund Confirmation Protocol', source: '7+ days micro coaching · no resolution confirmation', deployed: 'Week 5', status: 'Completed', badgeClass: 'badge-green', outcome: 'Returns FCR 25% → 82%; formal session logged with positive outcome' },
  { agent: 'Pieter Botha', topic: 'Returns Policy Accuracy', source: '7+ days micro · policy misquote pattern', deployed: 'Week 5', status: 'Completed', badgeClass: 'badge-green', outcome: 'Zero policy misquotes W6-W8; formal outcome: behaviours corrected' },
  { agent: 'Busisiwe Maseko', topic: 'Resolution & Close', source: '7+ days micro · refund close without confirmation', deployed: 'Week 5', status: 'In Progress', badgeClass: 'badge-amber', outcome: 'FCR improving; documentation pillar still below target' },
  { agent: 'Ayanda Mbeki', topic: 'Identity Verification on Returns', source: '7+ days micro · verification skipped', deployed: 'Week 5', status: 'Completed', badgeClass: 'badge-green', outcome: 'Verification 100% W7-W8; formal outcome: passed' },
  { agent: 'Zanele Ndlovu', topic: 'Escalation Criteria', source: 'Critical failure · escalation avoidance', deployed: 'Week 6', status: 'Open', badgeClass: 'badge-red', outcome: 'Second formal session scheduled - FCR still below 40%' },
  { agent: 'Thabo van der Merwe', topic: 'Handle Efficiency on Exchanges', source: 'Ops cluster · AHT 420s on sizing', deployed: 'Week 5', status: 'In Progress', badgeClass: 'badge-amber', outcome: 'AHT reducing week on week' },
  { agent: 'Michael Naidoo', topic: 'Benchmark', source: '-', deployed: '-', status: 'Benchmark', badgeClass: 'badge-navy', outcome: '84% Returns FCR - peer coaching source' },
]

export const COACHING_QUEUE_SUMMARY = [
  { text: '7 formal sessions', className: 'summary-chip' },
  { text: '3 completed', className: 'summary-chip summary-chip-green' },
  { text: '2 in progress', className: 'summary-chip summary-chip-amber' },
  { text: '1 open', className: 'summary-chip summary-chip-amber' },
  { text: '1 benchmark', className: 'summary-chip summary-chip-muted' },
]

export const FLAGGED_CALLS = [
  { callId: 'CL-RX-CF0001', agent: 'Pieter Botha', date: '2026-04-14', category: 'Returns & Refunds', flagReason: 'Critical failure · Policy misquote · 14-day window stated (30-day policy)', flagClass: 'flag-badge-critical', qaScore: '0', qaClass: 'val-red' },
  { callId: 'CL-RX-CF0002', agent: 'Lerato Nkosi', date: '2026-04-22', category: 'Returns & Refunds', flagReason: 'Critical failure · No resolution confirmation · Refund status not confirmed', flagClass: 'flag-badge-critical', qaScore: '0', qaClass: 'val-red' },
  { callId: 'CL-RX-CF0003', agent: 'Ayanda Mbeki', date: '2026-05-01', category: 'Returns & Refunds', flagReason: 'Critical failure · Verification failure · Return processed without ID check', flagClass: 'flag-badge-critical', qaScore: '0', qaClass: 'val-red' },
  { callId: 'CL-RX-CF0004', agent: 'Zanele Ndlovu', date: '2026-05-08', category: 'Returns & Refunds', flagReason: 'Critical failure · Escalation avoidance · Third contact from same customer', flagClass: 'flag-badge-critical', qaScore: '0', qaClass: 'val-red' },
  { callId: 'CL-RX-CF0005', agent: 'Busisiwe Maseko', date: '2026-04-18', category: 'Returns & Refunds', flagReason: 'Critical failure · No case notes · Repeat contact with no prior documentation', flagClass: 'flag-badge-critical', qaScore: '0', qaClass: 'val-red' },
]

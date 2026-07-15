import { WEEK_BOUNDARIES } from '../data/contactSearchConstants'

export const SOURCE_ORDER = ['voice_human', 'email_human', 'email_sienna', 'chat_human']

export const SOURCE_LABELS = {
  voice_human: 'Voice (Human)',
  email_human: 'Email (Human)',
  email_sienna: 'Email (AI Agent)',
  chat_human: 'Chat (Human)',
}

export const SOURCE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'voice_human', label: 'Voice' },
  { id: 'email_human', label: 'Email - Human' },
  { id: 'email_sienna', label: 'Email - AI Agent' },
  { id: 'chat_human', label: 'Chat' },
]

export const SOURCE_ROOT_CAUSES = {
  voice_human: 'Voice remains the largest human-handled channel and carries the full returns/refunds coaching arc. Performance is most sensitive to Returns & Exchanges, Refund Requests, and policy confirmation quality.',
  email_human: 'Human email is concentrated in more complex refund, returns, and reimbursement work after routine volume is handled by the AI Agent. The lower FCR reflects policy judgment and multi-step resolution rather than AI routing drag.',
  email_sienna: 'The AI Agent is intentionally routed to routine email drivers and resolves most Order Status, Refund Requests, and Shipping & Delivery contacts quickly. Handoffs are concentrated in Returns & Exchanges and Reimbursements & Adjustments where policy judgment is required.',
  chat_human: 'Chat is fully human-handled and skews toward faster order and delivery support. It follows the same human coaching controls but has less exposure to long-form returns documentation issues than email.',
}

function avg(values) {
  const nums = values.filter((v) => typeof v === 'number' && !Number.isNaN(v))
  return nums.length ? nums.reduce((sum, v) => sum + v, 0) / nums.length : 0
}

function pct(records, predicate) {
  return records.length ? (records.filter(predicate).length / records.length) * 100 : 0
}

function round1(v) {
  return Math.round(v * 10) / 10
}

function round2(v) {
  return Math.round(v * 100) / 100
}

function topDrivers(records) {
  const counts = new Map()
  records.forEach((r) => {
    const driver = r.driver_subcategory || r.call_subcategory || 'Unknown'
    counts.set(driver, (counts.get(driver) || 0) + 1)
  })
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, volume]) => ({ name, volume, detail: `${volume.toLocaleString()} contacts` }))
}

function aiEscalatedVolume(row) {
  if (row.source !== 'email_sienna') return 0
  if (typeof row.escalatedVolume === 'number') return row.escalatedVolume
  if (typeof row.escalationToHuman !== 'number') return 0
  return Math.round((row.volume * row.escalationToHuman) / 100)
}

function displayedDriverVolume(row) {
  return row.topDrivers.reduce((sum, driver) => sum + (driver.volume || 0), 0)
}

function sourceContributorRows(row) {
  const topDriverVolume = displayedDriverVolume(row)
  if (row.source !== 'email_sienna') {
    const otherVolume = Math.max(0, row.volume - topDriverVolume)
    if (!otherVolume) return row.topDrivers
    return [
      ...row.topDrivers,
      {
        name: 'Other contact drivers',
        volume: otherVolume,
        detail: `${otherVolume.toLocaleString()} contacts · remaining source volume`,
      },
    ]
  }
  const escalatedVolume = aiEscalatedVolume(row)
  return [
    ...row.topDrivers,
    {
      name: 'Escalated to human agents',
      volume: escalatedVolume,
      detail: `${escalatedVolume.toLocaleString()} contacts · escalated handoffs`,
    },
  ]
}

function weeklyTrend(records, source) {
  return WEEK_BOUNDARIES.map((week) => {
    const subset = records.filter((r) => r.source === source && r.call_date >= week.start && r.call_date <= week.end)
    return {
      csat: round2(avg(subset.map((r) => r.predicted_csat_score))),
      fcr: round1(pct(subset, (r) => r.fcr_resolved)),
    }
  })
}

export function aggregateSourcePerformance(records) {
  return SOURCE_ORDER.map((source) => {
    const subset = records.filter((r) => r.source === source)
    const weekly = weeklyTrend(records, source)
    return {
      source,
      label: SOURCE_LABELS[source],
      volume: subset.length,
      csat: round2(avg(subset.map((r) => r.predicted_csat_score))),
      fcr: round1(pct(subset, (r) => r.fcr_resolved)),
      rcr: round1(pct(subset, (r) => r.is_repeat_contact)),
      aht: Math.round(avg(subset.map((r) => r.call_handling_time))),
      responseTimeMinutes: round1(avg(subset.map((r) => r.response_time_minutes))),
      escalationToHuman: source === 'email_sienna' ? round1(pct(subset, (r) => r.escalated_to_human)) : null,
      escalatedVolume: source === 'email_sienna' ? subset.filter((r) => r.escalated_to_human).length : null,
      weeklyCsat: weekly.map((w) => w.csat),
      weeklyFcr: weekly.map((w) => w.fcr),
      topDrivers: topDrivers(subset),
      rootCause: SOURCE_ROOT_CAUSES[source],
    }
  })
}

export function sourcePerformanceFromDerived(sourceBlocks) {
  return SOURCE_ORDER.map((source) => {
    const row = sourceBlocks[source]
    return {
      source,
      label: row.label || SOURCE_LABELS[source],
      volume: row.volume,
      csat: row.csat,
      fcr: row.fcr,
      rcr: row.rcr,
      aht: row.aht,
      responseTimeMinutes: row.responseTimeMinutes,
      escalationToHuman: row.escalationToHuman,
      escalatedVolume: source === 'email_sienna' && typeof row.escalationToHuman === 'number'
        ? Math.round((row.volume * row.escalationToHuman) / 100)
        : null,
      weeklyCsat: row.weekly?.csat || [],
      weeklyFcr: row.weekly?.fcr || [],
      topDrivers: (row.topDrivers || []).map((driver) => ({
        name: driver.name,
        volume: driver.volume,
        detail: `${driver.volume.toLocaleString()} contacts`,
      })),
      rootCause: SOURCE_ROOT_CAUSES[source],
    }
  })
}

export function formatSourceTime(row) {
  if (row.source === 'email_sienna') return `${Math.round(row.responseTimeMinutes)} min`
  if (row.source === 'email_human') return `${(row.responseTimeMinutes / 60).toFixed(1)} hrs`
  return `${Math.floor(row.aht / 60)}m ${String(row.aht % 60).padStart(2, '0')}s`
}

export function buildSourceRowInsight(row) {
  const isAiAgent = row.source === 'email_sienna'
  return {
    title: row.label,
    subtitle: 'Channel & Source Performance · 8-week calibration',
    rootCause: row.rootCause,
    value: `${row.csat.toFixed(2)} CSAT · ${row.fcr.toFixed(1)}% FCR`,
    target: `${row.volume.toLocaleString()} contacts · ${formatSourceTime(row)}`,
    trendLabel: 'CSAT and FCR · 8-week trend',
    trendLabels: WEEK_BOUNDARIES.map((week) => week.label),
    trendData: row.weeklyCsat,
    secondaryTrendData: row.weeklyFcr,
    primaryTrendName: 'CSAT',
    secondaryTrendName: 'FCR',
    trendColor: row.source === 'email_sienna' ? '#2563eb' : '#1a7a4a',
    formatTrend: (v) => v.toFixed(2),
    secondaryFormatTrend: (v) => `${parseFloat(v.toFixed(1))}%`,
    contributorsLabel: isAiAgent ? 'Contact drivers by volume · 88% AI-resolved, 12% escalated' : 'Contact drivers by volume · top 5 + other',
    contributorsCol1: 'Driver',
    contributorsCol2: 'Volume',
    contributors: sourceContributorRows(row),
  }
}

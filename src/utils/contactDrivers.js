import { DRIVER_TAXONOMY } from '../data/contactDriverTaxonomy'

function avgMetric(records, getValue) {
  if (!records.length) return 0
  const values = getValue
    ? records.map(getValue).filter((v) => typeof v === 'number' && !Number.isNaN(v))
    : records
  if (!values.length) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

function pctTrue(records, field) {
  if (!records.length) return 0
  return (records.filter((r) => r[field]).length / records.length) * 100
}

export function aggregateDriversByL1(records) {
  const n = records.length || 1
  return Object.keys(DRIVER_TAXONOMY).map((l1) => {
    const subset = records.filter((r) => (r.driver_category || r.call_category) === l1)
    if (!subset.length) {
      return { name: l1, volume: 0, share: 0, fcr: 0, aht: 0, esc: 0 }
    }
    return {
      name: l1,
      volume: subset.length,
      share: Math.round((subset.length / n) * 1000) / 10,
      fcr: Math.round(pctTrue(subset, 'fcr_resolved') * 10) / 10,
      aht: Math.round(avgMetric(subset, (r) => r.call_handling_time)),
      esc: Math.round(pctTrue(subset, 'escalated') * 10) / 10,
    }
  }).filter((row) => row.volume > 0)
}

export function aggregateDriversByL2(records, l1Category) {
  const subset = records.filter((r) => (r.driver_category || r.call_category) === l1Category)
  if (!subset.length) return []
  const l2List = DRIVER_TAXONOMY[l1Category] || []
  return l2List.map((l2) => {
    const sub = subset.filter((r) => (r.driver_subcategory || r.call_subcategory) === l2)
    if (!sub.length) return null
    return {
      name: l2,
      volume: sub.length,
      share: Math.round((sub.length / subset.length) * 1000) / 10,
      fcr: Math.round(pctTrue(sub, 'fcr_resolved') * 10) / 10,
      aht: Math.round(avgMetric(sub, (r) => r.call_handling_time)),
      esc: Math.round(pctTrue(sub, 'escalated') * 10) / 10,
    }
  }).filter(Boolean).sort((a, b) => b.volume - a.volume)
}

export function topAgentsForDriver(records, l1Category, l2Driver, limit = 5) {
  const subset = records.filter(
    (r) =>
      (r.driver_category || r.call_category) === l1Category
      && (!l2Driver || (r.driver_subcategory || r.call_subcategory) === l2Driver),
  )
  const counts = new Map()
  for (const r of subset) {
    if (!r.agent_name) continue
    counts.set(r.agent_name, (counts.get(r.agent_name) || 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, volume]) => ({ name, volume }))
}

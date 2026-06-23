export function formatAht(seconds) {
  const s = Math.round(seconds)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}m ${r}s`
}

export function fmtUSD(n) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function fmtUSDWhole(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`
}

export function fmtUSDK(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}k`
  return fmtUSDWhole(n)
}

export function fmtDonutCentre(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000) return `$${Math.round(n / 1000)}k`
  return fmtUSDWhole(n)
}

export function fmtMillionShort(n) {
  return `$${(n / 1_000_000).toFixed(2)} M`
}

export function formatVariancePct(variancePct) {
  return `${variancePct >= 0 ? '+' : ''}${variancePct.toFixed(1)}%`
}

export function varianceColourClass(variancePct) {
  if (variancePct > 5) return 'chg-red'
  if (variancePct > 0) return 'chg-amber'
  return 'chg-green'
}

export function sparkLineColor(series) {
  const w1 = series[0]
  const w5 = series[series.length - 1]
  if (w5 > w1) return '#1a7a4a'
  if (w5 < w1) return '#c0392b'
  return '#1a1a2e'
}

export function sparkScoreClass(series) {
  const w1 = series[0]
  const w5 = series[series.length - 1]
  if (w5 > w1) return 'val-green'
  if (w5 < w1) return 'val-red'
  return ''
}

export function sparkDeltaText(series) {
  const w1 = series[0]
  const w5 = series[series.length - 1]
  const d = w5 - w1
  if (Math.abs(d) < 0.05) return 'W1 → W5: flat'
  const sign = d > 0 ? '+' : ''
  return `W1 ${w1.toFixed(1)} → W5 ${w5.toFixed(1)} (${sign}${d.toFixed(1)})`
}

export function formatDelta(d) {
  if (Math.abs(d) < 0.05) return { text: '0.0', cls: 'delta-flat' }
  const sign = d > 0 ? '+' : ''
  return { text: sign + d.toFixed(1), cls: d > 0 ? 'delta-pos' : 'delta-neg' }
}

export function metricColor(v) {
  if (v > 90) return 'val-green'
  if (v >= 70) return 'val-amber'
  return 'val-red'
}

export function statusBadgeClass(status) {
  const map = {
    'On Track': 'badge-green',
    'Action Needed': 'badge-red',
    Watch: 'badge-amber',
    Benchmark: 'badge-navy',
  }
  return map[status] || 'badge-green'
}

export function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const fmtPct = (v) => `${parseFloat(v.toFixed(1))}%`
export const fmtCsat = (v) => v.toFixed(2)

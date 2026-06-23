export function driverSignal(row) {
  if (row.fcr >= 95 && row.esc < 5) return { label: 'Best practice model', cls: 'signal-green' }
  if (row.esc >= 10 || row.fcr < 80) return { label: 'Primary driver', cls: 'signal-red' }
  if (row.name.includes('Payout')) return { label: 'Process dependency', cls: 'signal-amber' }
  if (row.volume >= 40) return { label: 'High volume', cls: 'signal-amber' }
  return { label: 'Stable', cls: 'signal-amber' }
}

export function fcrClass(pct) {
  if (pct >= 90) return 'fcr-good'
  if (pct >= 80) return 'fcr-warn'
  return 'fcr-bad'
}

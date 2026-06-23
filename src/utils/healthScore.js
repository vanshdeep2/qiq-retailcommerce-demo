import {
  ACTUAL_AHT,
  FCR,
  ESC_RATE,
  TR_RATE,
  RCR_RATE,
  ER_TARGET,
  TR_TARGET,
  RCR_TARGET,
} from '../data/executiveConstants'

export function computeHealthScore(targetAht) {
  const fcrScore = Math.min(100, FCR)
  const erScore = Math.min(100, (ER_TARGET / ESC_RATE) * 100)
  const ahtScore = Math.min(100, (targetAht / ACTUAL_AHT) * 100)
  const trScore = TR_RATE <= 0 ? 100 : Math.min(100, ((TR_TARGET - TR_RATE) / TR_TARGET) * 100)
  const rcrScore = Math.min(100, Math.max(0, (1 - RCR_RATE / RCR_TARGET) * 100))

  const health = Math.round(
    0.45 * fcrScore + 0.20 * erScore + 0.15 * ahtScore + 0.10 * trScore + 0.10 * rcrScore
  )

  return { health, fcrScore, erScore, ahtScore, trScore, rcrScore }
}

export function healthArcColor(score) {
  if (score >= 80) return '#1a7a4a'
  if (score >= 60) return '#d97706'
  return '#c0392b'
}

export function healthBandLabel(score) {
  if (score >= 80) return 'Healthy'
  if (score >= 60) return 'Watch'
  return 'At risk'
}

export function healthStatusColor(score) {
  const color = healthArcColor(score)
  if (color === '#1a7a4a') return '#4ade80'
  if (color === '#d97706') return '#fbbf24'
  return '#f87171'
}

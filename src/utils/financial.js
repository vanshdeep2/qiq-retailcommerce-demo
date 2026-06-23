import {
  ACTUAL_AHT,
  REPEAT_CONTACTS,
  UNNECESSARY_ESCALATIONS,
  PAYMENT_CONTACTS,
  MERCHANT_CHURN_PROXY,
  PERIOD_WEEKS,
} from '../data/executiveConstants'

export function handleCostPerContact(aht, costPerMin) {
  return (aht / 60) * costPerMin
}

export function weeklyWaste(actual, target, weeklyCalls, costPerMin) {
  return Math.max(0, actual - target) * weeklyCalls * costPerMin / 60
}

export function repeatCost(repeats, aht, costPerMin) {
  return repeats * handleCostPerContact(aht, costPerMin)
}

export function escalationUpliftCost(count, aht, costPerMin, multiplier) {
  return count * handleCostPerContact(aht, costPerMin) * (multiplier - 1)
}

export function computeFinancials({ targetAht, costPerMin, escMultiplier, weeklyCalls }) {
  const handleCost = handleCostPerContact(ACTUAL_AHT, costPerMin)
  const weekly = weeklyWaste(ACTUAL_AHT, targetAht, weeklyCalls, costPerMin)
  const annual = weekly * 52
  const wastePeriod = weekly * PERIOD_WEEKS
  const repeat = repeatCost(REPEAT_CONTACTS, ACTUAL_AHT, costPerMin)
  const escalation = escalationUpliftCost(UNNECESSARY_ESCALATIONS, ACTUAL_AHT, costPerMin, escMultiplier)
  const costTotal = wastePeriod + repeat + escalation

  const revCoaching = weekly * PERIOD_WEEKS
  const revPayment = repeat + REPEAT_CONTACTS * MERCHANT_CHURN_PROXY
  const revEscSave = escalation
  const revFcr = 0.04 * PAYMENT_CONTACTS * handleCost
  const revTotal = revCoaching + revPayment + revEscSave + revFcr
  const netTotal = costTotal + revTotal

  const variancePct = ((ACTUAL_AHT - targetAht) / targetAht) * 100

  return {
    handleCost,
    weekly,
    annual,
    wastePeriod,
    repeat,
    escalation,
    costTotal,
    revCoaching,
    revPayment,
    revEscSave,
    revFcr,
    revTotal,
    netTotal,
    variancePct,
    costDonut: [wastePeriod, repeat, escalation],
    revDonut: [revCoaching, revPayment, revEscSave, revFcr],
    annualRev: (revTotal / PERIOD_WEEKS) * 52,
  }
}

export const LTV_DEFAULTS = {
  avgOrderValue: 120,
  customerLtv: 4800,
  lifetimeMonths: 24,
  dissatisfiedPct: 18,
  churnBenchmark: 38,
  totalContacts: 10000,
}

const PERIOD_WEEKS = 8
const ANNUALISATION = 52 / PERIOD_WEEKS

const RISK_SHARE = {
  dissatisfied: 721_538 / 795_000,
  repeat: 27_692 / 795_000,
  unresolved: 44_615 / 795_000,
}

const PROTECTED_TO_RISK_RATIO = 423_000 / 795_000
const PROTECTED_SHARE = {
  coaching: 276_923 / 423_000,
  csat: 146_154 / 423_000,
}

const BASE_WEEKLY_RISK_K = [892, 918, 945, 968, 995, 920, 865, 795]

function annualise(periodValue) {
  return Math.round(periodValue * ANNUALISATION)
}

export function computeWeeklyRiskK(totalRisk) {
  const scale = totalRisk / 795_000
  return BASE_WEEKLY_RISK_K.map((v) => Math.round(v * scale))
}

export const LTV_WEEKLY_RISK_K = computeWeeklyRiskK(
  Math.round(
    LTV_DEFAULTS.totalContacts *
      (LTV_DEFAULTS.dissatisfiedPct / 100) *
      (LTV_DEFAULTS.churnBenchmark / 100) *
      LTV_DEFAULTS.customerLtv,
  ),
)

export function computeLtvFinancials(assumptions) {
  const { customerLtv, dissatisfiedPct, churnBenchmark, totalContacts } = assumptions

  const annualContacts = Math.round(totalContacts * ANNUALISATION)
  const dissatisfiedAnnual = Math.round(annualContacts * (dissatisfiedPct / 100))
  const periodDissatisfied = Math.round(totalContacts * (dissatisfiedPct / 100))

  const totalRisk = Math.round(
    periodDissatisfied * (churnBenchmark / 100) * customerLtv,
  )

  const dissatisfiedRisk = Math.round(totalRisk * RISK_SHARE.dissatisfied)
  const repeatRisk = Math.round(totalRisk * RISK_SHARE.repeat)
  const unresolvedRisk = totalRisk - dissatisfiedRisk - repeatRisk

  const totalProtected = Math.round(totalRisk * PROTECTED_TO_RISK_RATIO)
  const coachingProtected = Math.round(totalProtected * PROTECTED_SHARE.coaching)
  const csatProtected = totalProtected - coachingProtected

  const dissatisfiedRiskAnnual = annualise(dissatisfiedRisk)
  const repeatRiskAnnual = annualise(repeatRisk)
  const unresolvedRiskAnnual = annualise(unresolvedRisk)
  const totalRiskAnnual = annualise(totalRisk)
  const coachingProtectedAnnual = annualise(coachingProtected)
  const csatProtectedAnnual = annualise(csatProtected)
  const totalProtectedAnnual = annualise(totalProtected)
  const totalSurfacedPeriod = totalRisk + totalProtected
  const totalSurfacedAnnual = totalRiskAnnual + totalProtectedAnnual
  const weeklyRiskK = computeWeeklyRiskK(totalRisk)

  return {
    ltvPerCustomer: customerLtv,
    annualContacts,
    dissatisfiedAnnual,
    churnRate: churnBenchmark,
    dissatisfiedRisk,
    repeatRisk,
    unresolvedRisk,
    totalRisk,
    coachingProtected,
    csatProtected,
    totalProtected,
    dissatisfiedRiskAnnual,
    repeatRiskAnnual,
    unresolvedRiskAnnual,
    totalRiskAnnual,
    coachingProtectedAnnual,
    csatProtectedAnnual,
    totalProtectedAnnual,
    totalSurfacedPeriod,
    totalSurfacedAnnual,
    weeklyRiskK,
  }
}

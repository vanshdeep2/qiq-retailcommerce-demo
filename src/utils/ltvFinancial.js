export const LTV_DEFAULTS = {
  avgOrderValue: 120,
  customerLtv: 4800,
  lifetimeMonths: 24,
  dissatisfiedPct: 18,
  churnBenchmark: 38,
  totalContacts: 2200,
}

const PERIOD_WEEKS = 8
const ANNUALISATION = 52 / PERIOD_WEEKS

// 8-week period values (donut centre + segments)
const PERIOD_RISK = {
  dissatisfiedRisk: 721_538,
  repeatRisk: 27_692,
  unresolvedRisk: 44_615,
  totalRisk: 795_000,
}

const PERIOD_PROTECTED = {
  coachingProtected: 276_923,
  csatProtected: 146_154,
  totalProtected: 423_000,
}

// Annualised line items (legend)
const ANNUAL_RISK = {
  dissatisfiedRiskAnnual: 4_690_000,
  repeatRiskAnnual: 180_000,
  unresolvedRiskAnnual: 290_000,
  totalRiskAnnual: 5_160_000,
}

const ANNUAL_PROTECTED = {
  coachingProtectedAnnual: 1_800_000,
  csatProtectedAnnual: 950_000,
  totalProtectedAnnual: 2_750_000,
}

export function computeLtvFinancials(assumptions) {
  const { customerLtv, dissatisfiedPct, churnBenchmark, totalContacts } = assumptions

  const annualContacts = Math.round(totalContacts * ANNUALISATION)
  const dissatisfiedAnnual = Math.round(annualContacts * (dissatisfiedPct / 100))

  return {
    ltvPerCustomer: customerLtv,
    annualContacts,
    dissatisfiedAnnual,
    churnRate: churnBenchmark,
    ...PERIOD_RISK,
    ...PERIOD_PROTECTED,
    ...ANNUAL_RISK,
    ...ANNUAL_PROTECTED,
    totalSurfacedPeriod: PERIOD_RISK.totalRisk + PERIOD_PROTECTED.totalProtected,
    totalSurfacedAnnual: 7_900_000,
  }
}

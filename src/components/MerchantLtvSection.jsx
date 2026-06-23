import { useEffect, useState } from 'react'
import DonutWithCentre from './DonutWithCentre'
import LtvBreakdownDrawer from './LtvBreakdownDrawer'
import { PROTECTED_LINES, RISK_LINES } from '../data/ltvCopy'
import { fmtDonutCentre, fmtMillionShort, fmtUSDK } from '../utils/format'

const RISK_DONUT_COLORS = ['#c0392b', '#d9534f', '#e8806f']
const PROTECTED_DONUT_COLORS = ['#1a7a4a', '#228b5a']

function finCardKeyDown(setBreakdown, panel) {
  return (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setBreakdown(panel)
    }
  }
}

export default function MerchantLtvSection({ ltv, onOpenSettings }) {
  const [breakdown, setBreakdown] = useState(null)

  useEffect(() => {
    if (!breakdown) return undefined
    function onKey(e) {
      if (e.key === 'Escape') setBreakdown(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [breakdown])

  const riskDonut = [ltv.dissatisfiedRisk, ltv.repeatRisk, ltv.unresolvedRisk]
  const protectedDonut = [ltv.coachingProtected, ltv.csatProtected]

  return (
    <>
      <div className="connector">Customer Retention Risk · 8-Week Period</div>
      <div className="ltv-section-head">
        <p className="section-sublabel ltv-section-sublabel">
          Revenue at risk from dissatisfied customers - a retention problem, not a cost-centre problem · Adjust assumptions using view / edit assumptions
        </p>
        <button type="button" className="metrics-cta ltv-assumptions-cta" onClick={onOpenSettings}>
          View / edit assumptions
        </button>
      </div>

      <div className="fin-row">
        <div
          className="fin-card"
          onClick={() => setBreakdown('risk')}
          role="button"
          tabIndex={0}
          onKeyDown={finCardKeyDown(setBreakdown, 'risk')}
        >
          <div className="fin-card-top">
            <div className="fin-label">Revenue at Risk</div>
            <div className="fin-drill">View breakdown →</div>
          </div>
          <div className="fin-body">
            <DonutWithCentre data={riskDonut} colors={RISK_DONUT_COLORS} total={ltv.totalRisk} valueClass="val-red" />
            <div className="fin-legend">
              {RISK_LINES.map((line) => (
                <div key={line.key} className="leg-item">
                  <span className="leg-dot" style={{ background: line.dotColor }} />
                  <span className="leg-label">{line.legendLabel}</span>
                  <span className="leg-val val-red">{fmtDonutCentre(ltv[line.annualKey])}</span>
                </div>
              ))}
              <div className="leg-divider" />
              <div className="leg-item">
                <span className="leg-label" style={{ fontWeight: 600, color: 'var(--muted)' }}>Annualised</span>
                <span className="leg-val val-red">{fmtUSDK(ltv.totalRiskAnnual)}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="fin-card"
          onClick={() => setBreakdown('protected')}
          role="button"
          tabIndex={0}
          onKeyDown={finCardKeyDown(setBreakdown, 'protected')}
        >
          <div className="fin-card-top">
            <div className="fin-label">LTV Protected by Coaching · QiQ impact</div>
            <div className="fin-drill">View breakdown →</div>
          </div>
          <div className="fin-body">
            <DonutWithCentre data={protectedDonut} colors={PROTECTED_DONUT_COLORS} total={ltv.totalProtected} valueClass="val-green" />
            <div className="fin-legend">
              {PROTECTED_LINES.map((line) => (
                <div key={line.key} className="leg-item">
                  <span className="leg-dot" style={{ background: line.dotColor }} />
                  <span className="leg-label">{line.legendLabel}</span>
                  <span className="leg-val val-green">{fmtDonutCentre(ltv[line.annualKey])}</span>
                </div>
              ))}
              <div className="leg-divider" />
              <div className="leg-item">
                <span className="leg-label" style={{ fontWeight: 600, color: 'var(--muted)' }}>Annualised</span>
                <span className="leg-val val-green">{fmtUSDK(ltv.totalProtectedAnnual)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="net-card">
          <div className="net-eyebrow">Total Retention Impact Surfaced This Period</div>
          <div className="net-val">{fmtMillionShort(ltv.totalSurfacedPeriod)}</div>
          <div className="net-sub">Revenue at risk + LTV protected by coaching</div>
          <div className="net-annualised">Annualised · {fmtUSDK(ltv.totalSurfacedAnnual)}</div>
        </div>
      </div>

      <LtvBreakdownDrawer panel={breakdown} ltv={ltv} onClose={() => setBreakdown(null)} />
    </>
  )
}

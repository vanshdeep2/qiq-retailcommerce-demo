import { useEffect } from 'react'
import DonutWithCentre from './DonutWithCentre'
import { PROTECTED_LINES, RISK_LINES } from '../data/ltvCopy'
import { fmtUSD, fmtUSDK } from '../utils/format'

const RISK_DONUT_COLORS = ['#c0392b', '#d9534f', '#e8806f']
const PROTECTED_DONUT_COLORS = ['#1a7a4a', '#228b5a']
const PERIOD_WEEKS = 8

function BreakdownBucket({ line, value, valueClass }) {
  return (
    <div className="drawer-bucket ltv-breakdown-bucket">
      <div className={`drawer-bucket-val ${valueClass}`}>{fmtUSD(value)}</div>
      <div className="drawer-bucket-lbl">{line.title}</div>
      <div className="drawer-bucket-formula">{line.label}</div>
      <div className="drawer-bucket-formula ltv-breakdown-desc">{line.description}</div>
    </div>
  )
}

export default function LtvBreakdownDrawer({ panel, ltv, onClose }) {
  useEffect(() => {
    if (!panel) return undefined

    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [panel, onClose])

  if (!panel) return null

  const isRisk = panel === 'risk'
  const lines = isRisk ? RISK_LINES : PROTECTED_LINES
  const total = isRisk ? ltv.totalRisk : ltv.totalProtected
  const annualised = isRisk ? ltv.totalRiskAnnual : ltv.totalProtectedAnnual
  const donutData = lines.map((line) => ltv[line.key])
  const donutColors = isRisk ? RISK_DONUT_COLORS : PROTECTED_DONUT_COLORS
  const totalClass = isRisk ? 'val-red' : 'val-green'
  const alertClass = isRisk ? 'alert-red' : 'alert-green'

  return (
    <>
      <div className="drawer-overlay open" onClick={onClose} role="presentation" />
      <div className="drawer open">
        <div className="drawer-header">
          <div className="drawer-title">
            {isRisk ? 'Customer Revenue at Risk' : 'LTV Protected by Coaching'}
          </div>
          <button type="button" className="drawer-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <p className="drawer-subtitle">
          {isRisk
            ? 'Pre-coaching baseline · Exposure identified from quality cluster outputs before QiQ coaching interventions were applied to agents.'
            : 'QiQ coaching impact · LTV protected through QiQ-generated coaching deployed to agents.'}
        </p>

        <div className="drawer-section">
          <div className="drawer-section-lbl">
            8-week period · Total{' '}
            <span style={{ color: isRisk ? 'var(--red)' : 'var(--green)' }}>{fmtUSD(total)}</span>
          </div>

          <div className="ltv-breakdown-grid">
            <div className="ltv-breakdown-donut-cell">
              <DonutWithCentre
                data={donutData}
                colors={donutColors}
                total={total}
                valueClass={totalClass}
                size={148}
                cutout="75%"
                animate
                variant="drawer"
              />
            </div>

            {lines.map((line) => (
              <BreakdownBucket
                key={line.key}
                line={line}
                value={ltv[line.key]}
                valueClass={totalClass}
              />
            ))}
          </div>

          <div className={`alert-box ${alertClass}`}>Annualised: {fmtUSDK(annualised)}</div>
        </div>
      </div>
    </>
  )
}

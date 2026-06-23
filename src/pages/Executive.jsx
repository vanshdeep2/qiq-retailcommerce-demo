import { useCallback, useEffect, useMemo, useState } from 'react'
import Nav from '../components/Nav'
import FlowBar from '../components/FlowBar'
import KPITile from '../components/KPITile'
import NBACard from '../components/NBACard'
import SparklineChart from '../components/charts/SparklineChart'
import HealthScoreRing from '../components/charts/HealthScoreRing'
import FinancialDonut from '../components/charts/FinancialDonut'
import MerchantLtvSection from '../components/MerchantLtvSection'
import { LTV_DEFAULT_ASSUMPTION_TEXT } from '../data/ltvCopy'
import {
  ACTUAL_AHT,
  CALLS_PILL,
  CROSS_KPI_PATTERNS,
  CSAT,
  DEFAULTS,
  DRIVER_ROWS,
  ESC_RATE,
  FCR,
  LIVE_LABEL,
  PERIOD_WEEKS,
  RCR_RATE,
  TREND,
  TR_RATE,
  WK5,
} from '../data/executiveConstants'
import { computeFinancials } from '../utils/financial'
import { computeLtvFinancials, LTV_DEFAULTS } from '../utils/ltvFinancial'
import {
  computeHealthScore,
  healthArcColor,
  healthBandLabel,
  healthStatusColor,
} from '../utils/healthScore'
import { driverSignal, fcrClass } from '../utils/drivers'
import {
  formatAht,
  formatVariancePct,
  fmtUSD,
  fmtUSDK,
  fmtUSDWhole,
  varianceColourClass,
} from '../utils/format'
import '../styles/executive.css'

const COST_DONUT_COLORS = ['#c0392b', '#d9534f', '#e8806f']
const REV_DONUT_COLORS = ['#1a7a4a', '#228b5a', '#2fa870', '#5ac490']

const fmtPct = (v) => `${parseFloat(v.toFixed(1))}%`
const fmtCsat = (v) => v.toFixed(2)

function DrawerLineChart({ labels, data, color, formatValue }) {
  return (
    <div className="drawer-chart-wrap">
      <SparklineChart labels={labels} data={data} color={color} height={130} formatValue={formatValue} />
    </div>
  )
}

function DetailDrawer({ drawer, onClose, financials, targetAht }) {
  if (!drawer) return null

  const varianceClass = varianceColourClass(financials.variancePct)
  const varianceDir = financials.variancePct >= 0 ? 'up' : 'down'

  const titles = {
    trends: 'Operations Snapshot - Detail',
    cost: 'Cost Exposure - Full Breakdown',
    revenue: 'Revenue Opportunity - Full Breakdown',
  }

  return (
    <>
      <div className="drawer-overlay open" onClick={onClose} role="presentation" />
      <div className="drawer open">
        <div className="drawer-header">
          <div className="drawer-title">{titles[drawer]}</div>
          <button type="button" className="drawer-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {drawer === 'trends' && (
          <>
            <div className="drawer-section">
              <div className="drawer-kpi-header">
                <div>
                  <div className="drawer-section-lbl">AHT · 8-week</div>
                  <div className="drawer-kpi-val val-amber">{formatAht(ACTUAL_AHT)}</div>
                  <div className="drawer-kpi-sub">
                    Target: <span>{formatAht(targetAht)}</span>
                  </div>
                  <div className={`drawer-kpi-chg ${varianceClass}`}>
                    <span className="drawer-kpi-arrow">{varianceDir === 'up' ? '↑' : '↓'}</span>{' '}
                    {formatVariancePct(financials.variancePct)} vs target
                  </div>
                </div>
                <div className="drawer-w5-badge">Week 8</div>
              </div>
              <DrawerLineChart labels={WK5} data={TREND.aht} color="#d97706" formatValue={formatAht} />
            </div>
            <div className="drawer-section">
              <div className="drawer-kpi-header">
                <div>
                  <div className="drawer-section-lbl">FCR · 8-week</div>
                  <div className="drawer-kpi-val val-amber">{fmtPct(FCR)}</div>
                  <div className="drawer-kpi-sub">8-week trend</div>
                  <div className="drawer-kpi-chg chg-green">↑ Recovery W6-W8 after W5 returns coaching intervention</div>
                </div>
                <div className="drawer-w5-badge">Week 8</div>
              </div>
              <DrawerLineChart labels={WK5} data={TREND.fcr} color="#d97706" formatValue={fmtPct} />
            </div>
            <div className="drawer-section">
              <div className="drawer-kpi-header">
                <div>
                  <div className="drawer-section-lbl">Escalation Rate · 8-week</div>
                  <div className="drawer-kpi-val val-red">{fmtPct(ESC_RATE)}</div>
                  <div className="drawer-kpi-sub">Target: 5%</div>
                  <div className="drawer-kpi-chg chg-amber">↑ Elevated W1-W5 on returns queue · easing W6-W8</div>
                </div>
                <div className="drawer-w5-badge">Week 8</div>
              </div>
              <DrawerLineChart labels={WK5} data={TREND.esc} color="#c0392b" formatValue={fmtPct} />
            </div>
            <div className="drawer-section">
              <div className="drawer-kpi-header">
                <div>
                  <div className="drawer-section-lbl">CSAT · 8-week</div>
                  <div className="drawer-kpi-val val-amber">{fmtCsat(CSAT)}</div>
                  <div className="drawer-kpi-sub">/5 scale</div>
                  <div className="drawer-kpi-chg chg-green">↑ Partial recovery W6-W8 after W5 coaching on returns contacts</div>
                </div>
                <div className="drawer-w5-badge">Week 8</div>
              </div>
              <DrawerLineChart labels={WK5} data={TREND.csat} color="#d97706" formatValue={fmtCsat} />
            </div>
            <div className="drawer-section">
              <div className="drawer-kpi-header">
                <div>
                  <div className="drawer-lbl-row">
                    <div className="drawer-section-lbl">Transfer Rate · 8-week</div>
                    <span className="kpi-info-btn">
                      i
                      <span className="kpi-tooltip">
                        Transfer rate elevated W1-W5 on returns contacts. Formal coaching at W5 reduced unnecessary transfers on coached agents.
                      </span>
                    </span>
                  </div>
                  <div className="drawer-kpi-val val-amber">{fmtPct(TR_RATE)}</div>
                  <div className="drawer-kpi-sub">8-week trend</div>
                  <div className="drawer-kpi-chg chg-green">
                    <span className="trend-arrow">↓</span> Improving W6-W8 · down from W5 peak
                  </div>
                </div>
                <div className="drawer-w5-badge">Week 8</div>
              </div>
              <DrawerLineChart labels={WK5} data={TREND.tr} color="#1a7a4a" formatValue={fmtPct} />
            </div>
            <div className="drawer-section">
              <div className="drawer-kpi-header">
                <div>
                  <div className="drawer-lbl-row">
                    <div className="drawer-section-lbl">RCR · 8-week</div>
                    <span className="kpi-info-btn">
                      i
                      <span className="kpi-tooltip">
                        Repeat contact rate peaked W4-W5 on returns documentation gaps. W5 formal coaching and case notes protocol drove improvement W6-W8.
                      </span>
                    </span>
                  </div>
                  <div className="drawer-kpi-val val-amber">{fmtPct(RCR_RATE)}</div>
                  <div className="drawer-kpi-sub">8-week trend</div>
                  <div className="drawer-kpi-chg chg-amber">
                    <span className="trend-arrow">↓</span> Easing from W5 peak · returns queue still above target
                  </div>
                </div>
                <div className="drawer-w5-badge">Week 8</div>
              </div>
              <DrawerLineChart labels={WK5} data={TREND.rcr} color="#d97706" formatValue={fmtPct} />
            </div>
            <div className="alert-box alert-amber">
              W1-W4 decline on returns KPIs driven by documentation and refund confirmation gaps. W5 formal coaching intervention on four agents; W6-W8 shows FCR recovery, CSAT partial rebound, and RCR easing. Prioritize sustaining returns coaching gains over strict AHT reduction.
            </div>
          </>
        )}

        {drawer === 'cost' && (
          <>
            <div className="drawer-section">
              <div className="drawer-section-lbl">
                8-week period · Total <span style={{ color: 'var(--red)' }}>{fmtUSD(financials.costTotal)}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 14 }}>
                <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
                  <FinancialDonut data={financials.costDonut} colors={COST_DONUT_COLORS} size={140} cutout="68%" />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--red)' }}>{fmtUSD(financials.costTotal)}</div>
                    <div style={{ fontSize: 10, color: 'var(--light)' }}>{PERIOD_WEEKS} weeks</div>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr', gap: 9 }}>
                  <div className="drawer-bucket">
                    <div className="drawer-bucket-val val-red">{fmtUSD(financials.wastePeriod)}</div>
                    <div className="drawer-bucket-lbl">Wasted handle time</div>
                    <div className="drawer-bucket-formula">(AHT - target) × weekly calls × cost/min ÷ 60 × {PERIOD_WEEKS} weeks</div>
                  </div>
                  <div className="drawer-bucket">
                    <div className="drawer-bucket-val val-red">{fmtUSD(financials.repeat)}</div>
                    <div className="drawer-bucket-lbl">Repeat contact cost</div>
                    <div className="drawer-bucket-formula">9 repeats × (AHT ÷ 60 × cost/min)</div>
                  </div>
                  <div className="drawer-bucket">
                    <div className="drawer-bucket-val val-red">{fmtUSD(financials.escalation)}</div>
                    <div className="drawer-bucket-lbl">Escalation uplift</div>
                    <div className="drawer-bucket-formula">87 escalations × handle cost × (multiplier - 1)</div>
                  </div>
                </div>
              </div>
              <div className="alert-box alert-red">Annualised: {fmtUSDK(financials.annual)}</div>
            </div>
            <div className="drawer-section">
              <div className="drawer-section-lbl">Assumptions</div>
              <div className="alert-box alert-amber" style={{ marginBottom: 0 }}>
                Figures use standard demo assumptions for target AHT, cost per minute, escalation multiplier, and weekly volume.
              </div>
            </div>
          </>
        )}

        {drawer === 'revenue' && (
          <>
            <div className="drawer-section">
              <div className="drawer-section-lbl">
                8-week period · Total <span style={{ color: 'var(--green)' }}>{fmtUSD(financials.revTotal)}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 14 }}>
                <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
                  <FinancialDonut data={financials.revDonut} colors={REV_DONUT_COLORS} size={140} cutout="68%" />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--green)' }}>{fmtUSD(financials.revTotal)}</div>
                    <div style={{ fontSize: 10, color: 'var(--light)' }}>{PERIOD_WEEKS} weeks</div>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
                  <div className="drawer-bucket">
                    <div className="drawer-bucket-val val-green">{fmtUSD(financials.revCoaching)}</div>
                    <div className="drawer-bucket-lbl">AHT coaching at scale</div>
                    <div className="drawer-bucket-formula">Weekly waste × {PERIOD_WEEKS} weeks</div>
                  </div>
                  <div className="drawer-bucket">
                    <div className="drawer-bucket-val val-green">{fmtUSD(financials.revPayment)}</div>
                    <div className="drawer-bucket-lbl">Payment protocol</div>
                    <div className="drawer-bucket-formula">9 × handle cost + 9 × $15 churn proxy</div>
                  </div>
                  <div className="drawer-bucket">
                    <div className="drawer-bucket-val val-green">{fmtUSD(financials.revEscSave)}</div>
                    <div className="drawer-bucket-lbl">Escalation savings</div>
                    <div className="drawer-bucket-formula">Full escalation uplift recoverable</div>
                  </div>
                  <div className="drawer-bucket">
                    <div className="drawer-bucket-val val-green">{fmtUSD(financials.revFcr)}</div>
                    <div className="drawer-bucket-lbl">FCR uplift on payment contacts</div>
                    <div className="drawer-bucket-formula">4% × 63 payment contacts × handle cost</div>
                  </div>
                </div>
              </div>
              <div className="alert-box alert-green">Annualised: {fmtUSDK(financials.annualRev)}</div>
            </div>
            <div className="drawer-section">
              <div className="drawer-section-lbl">Assumptions</div>
              <div className="alert-box alert-amber" style={{ marginBottom: 0 }}>
                Figures use standard demo financial assumptions for this 8-week period.
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

const LTV_FIELDS = [
  { id: 'avgOrderValue', label: 'Average order value ($)', step: 1 },
  { id: 'customerLtv', label: 'Customer LTV over 24 months ($)', step: 10 },
  { id: 'dissatisfiedPct', label: 'Contacts with CSAT below 3 (%)', step: 0.5 },
  { id: 'churnBenchmark', label: 'Assumed churn rate for dissatisfied customers (%)', step: 0.5 },
  { id: 'totalContacts', label: 'Total contacts in period', step: 1 },
]

function LtvSettingsDrawer({
  open,
  onClose,
  draft,
  onChange,
  onRecalculate,
  onReset,
}) {
  if (!open) return null

  return (
    <>
      <div className="drawer-overlay open" onClick={onClose} role="presentation" />
      <div className="drawer open">
        <div className="drawer-header">
          <div className="drawer-title">LTV Assumptions</div>
          <button type="button" className="drawer-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <p className="drawer-subtitle">
          Adjust customer LTV and retention assumptions. Click Recalculate to update all figures on the page.
        </p>
        {LTV_FIELDS.map((field) => (
          <div key={field.id} className="drawer-field">
            <label htmlFor={`input-ltv-${field.id}`}>{field.label}</label>
            <input
              id={`input-ltv-${field.id}`}
              type="number"
              step={field.step}
              value={draft[field.id]}
              onChange={(e) => onChange(field.id, Number(e.target.value))}
            />
          </div>
        ))}
        <button type="button" className="btn-recalc" onClick={onRecalculate}>
          Recalculate
        </button>
        <button type="button" className="drawer-reset" onClick={onReset}>
          Reset to defaults
        </button>
        <div className="drawer-assumption-info">
          <div className="drawer-assumption-info-heading">Assumption info</div>
          <div className="drawer-assumption-info-label">Default Assumption</div>
          <p className="drawer-assumption-info-text">{LTV_DEFAULT_ASSUMPTION_TEXT}</p>
        </div>
      </div>
    </>
  )
}

export default function Executive() {
  const [detailDrawer, setDetailDrawer] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [ltvAssumptions, setLtvAssumptions] = useState(LTV_DEFAULTS)
  const [ltvDraft, setLtvDraft] = useState(LTV_DEFAULTS)

  const financials = useMemo(() => computeFinancials(DEFAULTS), [])
  const ltv = useMemo(() => computeLtvFinancials(ltvAssumptions), [ltvAssumptions])

  const health = useMemo(() => computeHealthScore(DEFAULTS.targetAht), [])
  const healthColor = healthArcColor(health.health)
  const statusColor = healthStatusColor(health.health)

  const closeDrawers = useCallback(() => {
    setDetailDrawer(null)
    setSettingsOpen(false)
  }, [])

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') closeDrawers()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [closeDrawers])

  useEffect(() => {
    if (settingsOpen) setLtvDraft(ltvAssumptions)
  }, [settingsOpen, ltvAssumptions])

  const handleLtvDraftChange = (key, value) => {
    setLtvDraft((prev) => ({ ...prev, [key]: value }))
  }

  const handleLtvRecalculate = () => {
    setLtvAssumptions(ltvDraft)
    setSettingsOpen(false)
  }

  const resetLtvDefaults = () => {
    setLtvDraft({ ...LTV_DEFAULTS })
  }

  const maxVol = Math.max(...DRIVER_ROWS.map((r) => r.volume))
  const ahtVarianceDir = financials.variancePct >= 0 ? 'up' : 'down'

  return (
    <>
      <Nav currentPage="executive" liveLabel={LIVE_LABEL} callsPill={CALLS_PILL} />

      <div className="page">
        <div className="briefing-kicker">QiQ Client Intelligence</div>
        <h1 className="briefing-title">Crestline Intelligence Briefing</h1>
        <p className="briefing-subtitle briefing-intro">
          Crestline is a US fashion and apparel brand. They sell clothing and accessories online, shipping across the US and Canada, with a strong repeat buyer base.
        </p>

        <div className="connector">This period - at a glance.</div>
        <div className="hero">
          <div className="hero-left">
            <div className="hero-eyebrow">QiQ Weekly Intelligence · Week 8 of 8</div>
            <div className="hero-headline">
              CSAT decline on returns contacts puts {fmtUSDK(ltv.totalRisk)} in customer LTV at risk - formal coaching at W5 is reversing the trend
            </div>
            <div className="hero-narrative">
              <p>
                <strong>Detect (W1–W4):</strong> Returns &amp; Refunds queue showed rising AHT, climbing repeat contact rate (37%), and falling FCR (50%) and CSAT (3.1). Daily micro coaching fired but behaviour did not improve.
              </p>
              <p>
                <strong>Act (W5):</strong> Four agents flagged for formal TL-led coaching after 7+ consecutive days of unresolved refund confirmations. Intervention marked across all CCM trend charts.
              </p>
              <p>
                <strong>Impact (W6–W8):</strong> Returns FCR rose 22 points, CSAT partially recovered, repeat contacts dropped, and critical failures fell from 85 (W1–W4) to 26 (W6–W8).
              </p>
            </div>
            <p className="hero-wow">Period actuals: CSAT 3.6 (target 4.2) · FCR 61% (target 78%) · RCR 23% (target &lt;12%) · {fmtUSDK(ltv.totalRisk)} revenue at risk</p>
            <div className="hero-chips">
              <div className="hero-chip chip-red">
                <span className="chip-dot" style={{ background: '#fca5a5' }} />
                CSAT 3.6 · 18% of contacts below 3 · retention risk
              </div>
              <div className="hero-chip chip-amber">
                <span className="chip-dot" style={{ background: '#fbbf24' }} />
                Returns &amp; Refunds · worst queue on every KPI
              </div>
              <div className="hero-chip chip-green">
                <span className="chip-dot" style={{ background: '#4ade80' }} />
                W5 coaching · Returns FCR +22pts W5 to W8
              </div>
            </div>
          </div>
          <div className="hero-divider" />
          <div className="hero-right">
            <div className="score-wrap">
              <HealthScoreRing score={health.health} color={healthColor} />
              <div className="score-inner">
                <div className="score-num">{health.health}</div>
                <div className="score-lbl-row">
                  <span className="score-lbl">Health</span>
                  <span className="score-info-btn">
                    i
                    <div className="score-tooltip">
                      <div className="score-tooltip-title">Health Score - how it&apos;s calculated</div>
                      <div className="score-tooltip-row">
                        <span className="score-tooltip-kpis">FCR - First Contact Resolution</span>
                        <span className="score-tooltip-wt">45%</span>
                      </div>
                      <div className="score-tooltip-row">
                        <span className="score-tooltip-kpis">Escalation Rate</span>
                        <span className="score-tooltip-wt">20%</span>
                      </div>
                      <div className="score-tooltip-row">
                        <span className="score-tooltip-kpis">AHT - Average Handle Time</span>
                        <span className="score-tooltip-wt">15%</span>
                      </div>
                      <div className="score-tooltip-row">
                        <span className="score-tooltip-kpis">Transfer Rate</span>
                        <span className="score-tooltip-wt">10%</span>
                      </div>
                      <div className="score-tooltip-row">
                        <span className="score-tooltip-kpis">RCR - Repeat Contact Rate</span>
                        <span className="score-tooltip-wt">10%</span>
                      </div>
                      <div className="score-tooltip-ranges">
                        <div className="score-tooltip-range">
                          <div className="score-tooltip-range-dot" style={{ background: '#1a7a4a' }} />
                          80-100 · Healthy
                        </div>
                        <div className="score-tooltip-range">
                          <div className="score-tooltip-range-dot" style={{ background: '#d97706' }} />
                          60-79 · Watch
                        </div>
                        <div className="score-tooltip-range">
                          <div className="score-tooltip-range-dot" style={{ background: '#c0392b' }} />
                          Below 60 · At risk
                        </div>
                      </div>
                      <div className="score-tooltip-breakdown">
                        FCR {Math.round(health.fcrScore)} · ER {Math.round(health.erScore)} · AHT {Math.round(health.ahtScore)} · TR {Math.round(health.trScore)} · RCR {Math.round(health.rcrScore)} → <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{health.health}</strong>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>
            <div className="score-status-row">
              <span className="score-status" style={{ color: statusColor }}>
                {healthBandLabel(health.health)}
              </span>
              <span className="score-vel">vs W5 intervention: FCR +7.3pts · CSAT +0.3</span>
            </div>
          </div>
        </div>

        <div className="connector">Operations Snapshot · Week 8</div>
        <p className="connector-sub">8-week operational metrics vs target.</p>
        <div className="trend-row">
          <KPITile
            label="AHT · 8-week"
            value={formatAht(ACTUAL_AHT)}
            target={`Target: ${formatAht(DEFAULTS.targetAht)}`}
            variance={`${formatVariancePct(financials.variancePct)} vs target`}
            varianceDirection={ahtVarianceDir}
            colour={financials.variancePct > 5 ? 'red' : financials.variancePct > 0 ? 'amber' : 'green'}
            onClick={() => setDetailDrawer('trends')}
          >
            <SparklineChart labels={WK5} data={TREND.aht} color="#d97706" formatValue={formatAht} />
          </KPITile>
          <KPITile
            label="FCR · 8-week"
            value="61%"
            target="Target: 78%"
            changeText="↓ -17pts vs target · recovering W6–W8"
            colour="red"
            onClick={() => setDetailDrawer('trends')}
          >
            <SparklineChart labels={WK5} data={TREND.fcr} color="#c0392b" formatValue={fmtPct} />
          </KPITile>
          <KPITile
            label="CSAT · 8-week"
            value="3.60"
            target="Target: 4.2"
            changeText="↓ Returns queue dragging average down"
            colour="amber"
            onClick={() => setDetailDrawer('trends')}
          >
            <SparklineChart labels={WK5} data={TREND.csat} color="#d97706" formatValue={fmtCsat} />
          </KPITile>
        </div>

        <MerchantLtvSection ltv={ltv} onOpenSettings={() => setSettingsOpen(true)} />

        <div className="connector">What is driving this.</div>
        <div className="driving-panel">
          <div className="driving-tab-bar">
            <span className="driving-tab">Contact drivers</span>
          </div>
          <div className="drivers-table-wrap">
            <table className="drivers-table">
              <thead>
                <tr>
                  <th>Subcategory</th>
                  <th>Volume</th>
                  <th>Share</th>
                  <th>FCR</th>
                  <th>AHT</th>
                  <th>Signal</th>
                </tr>
              </thead>
              <tbody>
                {DRIVER_ROWS.map((row) => {
                  const sig = driverSignal(row)
                  const barPct = Math.round((row.volume / maxVol) * 100)
                  const barCls = sig.cls === 'signal-green' ? 'vol-bar vol-bar-green' : 'vol-bar'
                  return (
                    <tr key={row.name}>
                      <td className="subcat-name">{row.name}</td>
                      <td>
                        <div className="vol-cell">
                          <span className="vol-num">{row.volume}</span>
                          <div className="vol-bar-wrap">
                            <div className={barCls} style={{ width: `${barPct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td>{row.share}%</td>
                      <td className={fcrClass(row.fcr)}>{row.fcr}%</td>
                      <td className={row.aht > 480 ? 'aht-bad' : 'aht-ok'}>{formatAht(row.aht)}</td>
                      <td>
                        <span className={`signal-badge ${sig.cls}`}>{sig.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="driving-cross-kpi">
            <div className="ckp-grid">
              {CROSS_KPI_PATTERNS.map((pattern) => (
                <div key={pattern.label} className="ckp-card">
                  <div className="ckp-label">{pattern.label}</div>
                  <div className="ckp-headline">{pattern.headline}</div>
                  <div className="ckp-body">{pattern.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="connector">Actions.</div>
        <div className="bottom-row">
          <div className="bottom-card">
            <div className="bottom-top">
              <div className="bottom-label">Decide now</div>
            </div>
            <div className="dec-row">
              <div className="dec-bar" style={{ background: 'var(--red)' }} />
              <div className="dec-body">
                <div className="dec-title">Scale formal coaching on returns agents - refund confirmation protocol from Michael Naidoo benchmark</div>
                <span className="dec-type type-pol">Coaching</span>
              </div>
              <div className="dec-cost">{fmtUSDK(ltv.coachingProtectedAnnual)}</div>
            </div>
            <div className="dec-row">
              <div className="dec-bar" style={{ background: 'var(--amber)' }} />
              <div className="dec-body">
                <div className="dec-title">Mandate case notes on all repeat returns contacts - Documentation Accuracy pillar</div>
                <span className="dec-type type-pol">Process</span>
              </div>
              <div className="dec-cost">↓ RCR</div>
            </div>
          </div>
          <div className="bottom-card">
            <div className="bottom-top">
              <div className="bottom-label">Ready to execute</div>
            </div>
            <NBACard
              number={1}
              title="Extend W5 formal coaching model to remaining returns underperformers - Zanele Ndlovu escalation criteria priority"
              kpis={['FCR', 'CSAT', 'RCR']}
              impact="High"
            />
            <NBACard
              number={2}
              title="Make 30-day return policy card visible on every returns contact - eliminate policy misquote critical failures"
              kpis={['CF', 'CSAT']}
              impact="High"
            />
            <NBACard
              number={3}
              title="Scale Michael Naidoo returns close protocol across full Returns & Refunds squad"
              kpis={['FCR', 'AHT']}
              impact={fmtUSDK(ltv.totalProtectedAnnual)}
            />
          </div>
          <div className="bottom-card">
            <div className="bottom-top">
              <div className="bottom-label">Watch next week</div>
            </div>
            <div className="watch-row">
              <div className="watch-dot" style={{ background: 'var(--red)' }} />
              <div>
                <div className="watch-title">Repeat contact rate 23% - nearly double 12% target</div>
                <div className="watch-proj">Returns queue drives 37% RCR. Track whether documentation coaching reduces repeats below 15% by W10.</div>
              </div>
            </div>
            <div className="watch-row">
              <div className="watch-dot" style={{ background: 'var(--amber)' }} />
              <div>
                <div className="watch-title">Zanele Ndlovu - 34% Returns FCR · 3 critical failures</div>
                <div className="watch-proj">Second formal coaching session open. Escalation avoidance remains the primary risk on the queue.</div>
              </div>
            </div>
            <div className="watch-row">
              <div className="watch-dot" style={{ background: 'var(--amber)' }} />
              <div>
                <div className="watch-title">CSAT 3.6/5 - 18% of contacts below 3</div>
                <div className="watch-proj">At 38% churn benchmark and $4,800 LTV, dissatisfied contacts represent {fmtUSDK(ltv.dissatisfiedRiskAnnual)} in revenue at risk annually. Retention recovery depends on returns coaching sustaining W6-W8 gains.</div>
              </div>
            </div>
          </div>
        </div>

        <FlowBar activePage="executive" />
      </div>

      <DetailDrawer
        drawer={detailDrawer}
        onClose={() => setDetailDrawer(null)}
        financials={financials}
        targetAht={DEFAULTS.targetAht}
      />

      <LtvSettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        draft={ltvDraft}
        onChange={handleLtvDraftChange}
        onRecalculate={handleLtvRecalculate}
        onReset={resetLtvDefaults}
      />
    </>
  )
}

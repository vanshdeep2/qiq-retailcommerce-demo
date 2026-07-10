import { useCallback, useEffect, useMemo, useState } from 'react'
import Nav from '../components/Nav'
import FlowBar from '../components/FlowBar'
import KPITile from '../components/KPITile'
import NBACard from '../components/NBACard'
import SparklineChart from '../components/charts/SparklineChart'
import HealthScoreRing from '../components/charts/HealthScoreRing'
import MerchantLtvSection from '../components/MerchantLtvSection'
import DriverDrilldownDrawer from '../components/DriverDrilldownDrawer'
import MetricInsightDrawer, { buildLtvNetInsight } from '../components/MetricInsightDrawer'
import ModalShell from '../components/ModalShell'
import { LTV_DEFAULT_ASSUMPTION_TEXT } from '../data/ltvCopy'
import {
  ACTUAL_AHT,
  CALLS_PILL,
  CROSS_KPI_PATTERNS,
  DEFAULTS,
  ER_TARGET,
  ESC_RATE,
  LIVE_LABEL,
  RCR_RATE,
  RCR_TARGET,
  TR_RATE,
  TR_TARGET,
  TREND,
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
import { aggregateDriversByL1, aggregateDriversByL2 } from '../utils/contactDrivers'
import {
  formatAht,
  formatVariancePct,
  fmtUSDK,
} from '../utils/format'
import '../styles/executive.css'

const fmtPct = (v) => `${parseFloat(v.toFixed(1))}%`
const fmtCsat = (v) => v.toFixed(2)

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
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="LTV Assumptions"
      subtitle="Adjust customer LTV and retention assumptions. Click Recalculate to update all figures on the page."
      size="md"
    >
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
    </ModalShell>
  )
}

export default function Executive() {
  const [insightMetric, setInsightMetric] = useState(null)
  const [insightOverrides, setInsightOverrides] = useState(null)
  const [driverCategory, setDriverCategory] = useState(null)
  const [calls, setCalls] = useState([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showAllSnapshotMetrics, setShowAllSnapshotMetrics] = useState(false)
  const [ltvAssumptions, setLtvAssumptions] = useState(LTV_DEFAULTS)
  const [ltvDraft, setLtvDraft] = useState(LTV_DEFAULTS)

  useEffect(() => {
    fetch('/data/contact_search_data.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load contact data')
        return r.json()
      })
      .then(setCalls)
      .catch(() => setCalls([]))
  }, [])

  const l1Drivers = useMemo(() => aggregateDriversByL1(calls), [calls])
  const l2Drivers = useMemo(
    () => (driverCategory ? aggregateDriversByL2(calls, driverCategory) : []),
    [calls, driverCategory],
  )

  const financials = useMemo(() => computeFinancials(DEFAULTS), [])
  const ltv = useMemo(() => computeLtvFinancials(ltvAssumptions), [ltvAssumptions])

  const health = useMemo(() => computeHealthScore(DEFAULTS.targetAht), [])
  const healthColor = healthArcColor(health.health)
  const statusColor = healthStatusColor(health.health)

  const openInsight = useCallback((metricId, overrides = null) => {
    setInsightMetric(metricId)
    setInsightOverrides(overrides)
  }, [])

  const closeDrawers = useCallback(() => {
    setInsightMetric(null)
    setInsightOverrides(null)
    setDriverCategory(null)
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

  const maxVol = Math.max(...(l1Drivers.map((r) => r.volume)), 1)
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
                <strong>Detect (W1–W4):</strong> Returns &amp; Refunds queue showed rising AHT, climbing repeat contact rate (37% returns queue), and falling FCR (50% returns queue) and CSAT (3.1 returns queue). Daily micro coaching fired but behaviour did not improve.
              </p>
              <p>
                <strong>Act (W5):</strong> Four agents flagged for formal TL-led coaching after 7+ consecutive days of unresolved refund confirmations. Intervention marked across all CCM trend charts.
              </p>
              <p>
                <strong>Impact (W6–W8):</strong> Returns FCR rose 22 points, CSAT partially recovered, repeat contacts dropped, and critical failures fell from 387 (W1–W4) to 118 (W6–W8).
              </p>
            </div>
            <p className="hero-wow">Period actuals: CSAT 3.6 (target 4.2) · FCR 61% (target 78%) · RCR 23% (target &lt;12%) · {fmtUSDK(ltv.totalRisk)} revenue at risk</p>
            <div className="hero-chips">
              <button type="button" className="hero-chip chip-red clickable-card" onClick={() => setInsightMetric('exec-chip-csat')}>
                <span className="chip-dot" style={{ background: '#fca5a5' }} />
                CSAT 3.6 · 18% of contacts below 3 · retention risk
              </button>
              <button type="button" className="hero-chip chip-amber clickable-card" onClick={() => setInsightMetric('exec-chip-returns')}>
                <span className="chip-dot" style={{ background: '#fbbf24' }} />
                Returns &amp; refund drivers · worst on every KPI
              </button>
              <button type="button" className="hero-chip chip-green clickable-card" onClick={() => setInsightMetric('exec-chip-coaching')}>
                <span className="chip-dot" style={{ background: '#4ade80' }} />
                W5 coaching · Returns FCR +22pts W5 to W8
              </button>
            </div>
          </div>
          <div className="hero-divider" />
          <div className="hero-right">
            <button
              type="button"
              className="hero-score-block clickable-card"
              onClick={() => setInsightMetric('exec-health-score')}
            >
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
              <div className="score-drill">Details →</div>
              <div className="score-status" style={{ color: statusColor }}>
                {healthBandLabel(health.health)}
              </div>
              <div className="score-vel">vs W5 intervention: FCR +7.3pts · CSAT +0.3</div>
            </button>
          </div>
        </div>

        <div className="connector">Operations Snapshot · Week 8</div>
        <div className="snapshot-section-head">
          <p className="connector-sub">8-week operational metrics vs target.</p>
          <button
            type="button"
            className="metrics-cta"
            onClick={() => setShowAllSnapshotMetrics((v) => !v)}
          >
            {showAllSnapshotMetrics ? 'Show fewer →' : 'All metrics →'}
          </button>
        </div>
        <div className="trend-row">
          <KPITile
            label="AHT · 8-week"
            value={formatAht(ACTUAL_AHT)}
            target={`Target: ${formatAht(DEFAULTS.targetAht)}`}
            variance={`${formatVariancePct(financials.variancePct)} vs target`}
            varianceDirection={ahtVarianceDir}
            colour={financials.variancePct > 5 ? 'red' : financials.variancePct > 0 ? 'amber' : 'green'}
            onClick={() => setInsightMetric('exec-aht')}
          >
            <SparklineChart labels={WK5} data={TREND.aht} color="#d97706" formatValue={formatAht} />
          </KPITile>
          <KPITile
            label="FCR · 8-week"
            value="61%"
            target="Target: 78%"
            changeText="↓ -17pts vs target · recovering W6–W8"
            colour="red"
            onClick={() => setInsightMetric('exec-fcr')}
          >
            <SparklineChart labels={WK5} data={TREND.fcr} color="#c0392b" formatValue={fmtPct} />
          </KPITile>
          {showAllSnapshotMetrics && (
            <>
              <KPITile
                label="CSAT · 8-week"
                value="3.60"
                target="Target: 4.2"
                changeText="↓ Returns drivers dragging average down"
                colour="amber"
                onClick={() => setInsightMetric('exec-csat')}
              >
                <SparklineChart labels={WK5} data={TREND.csat} color="#d97706" formatValue={fmtCsat} />
              </KPITile>
              <KPITile
                label="Escalation Rate · 8-week"
                value={`${ESC_RATE}%`}
                target={`Target: ${ER_TARGET}%`}
                changeText="↑ Elevated W1–W5 on returns · easing W6–W8"
                colour="red"
                onClick={() => setInsightMetric('exec-esc')}
              >
                <SparklineChart labels={WK5} data={TREND.esc} color="#c0392b" formatValue={fmtPct} />
              </KPITile>
              <KPITile
                label="Transfer Rate · 8-week"
                value={`${TR_RATE}%`}
                target={`Target: ${TR_TARGET}%`}
                changeText="↓ Improving W6–W8 · down from W5 peak"
                colour="amber"
                onClick={() => setInsightMetric('exec-tr')}
              >
                <SparklineChart labels={WK5} data={TREND.tr} color="#1a7a4a" formatValue={fmtPct} />
              </KPITile>
            </>
          )}
          <KPITile
            label="RCR · 8-week"
            value={`${RCR_RATE}%`}
            target={`Target: ${RCR_TARGET}%`}
            changeText="↓ Easing from W5 peak · still above target"
            colour="red"
            onClick={() => setInsightMetric('exec-rcr')}
          >
            <SparklineChart labels={WK5} data={TREND.rcr} color="#d97706" formatValue={fmtPct} />
          </KPITile>
        </div>

        <MerchantLtvSection
          ltv={ltv}
          onOpenSettings={() => setSettingsOpen(true)}
          onNetCardClick={() => openInsight('exec-ltv-net', buildLtvNetInsight(ltv))}
        />

        <div className="connector">What is driving this.</div>
        <div className="driving-panel">
          <div className="driving-tab-bar">
            <span className="driving-tab">Contact drivers</span>
          </div>
          <div className="drivers-table-wrap">
            <table className="drivers-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Volume</th>
                  <th>Share</th>
                  <th>FCR</th>
                  <th>AHT</th>
                  <th>Signal</th>
                </tr>
              </thead>
              <tbody>
                {l1Drivers.map((row) => {
                  const sig = driverSignal(row)
                  const barPct = Math.round((row.volume / maxVol) * 100)
                  const barCls = sig.cls === 'signal-green' ? 'vol-bar vol-bar-green' : 'vol-bar'
                  return (
                    <tr
                      key={row.name}
                      className="drivers-row-clickable"
                      onClick={() => setDriverCategory(row.name)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setDriverCategory(row.name)
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <td className="subcat-name">
                        {row.name}
                        <span className="driver-drill-hint">View drivers →</span>
                      </td>
                      <td>
                        <div className="vol-cell">
                          <span className="vol-num">{row.volume.toLocaleString()}</span>
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
                <button
                  key={pattern.label}
                  type="button"
                  className={`ckp-card ckp-card--${pattern.accent} clickable-card`}
                  onClick={() => setInsightMetric(pattern.id)}
                >
                  <div className="ckp-label">{pattern.label}</div>
                  <div className="ckp-headline">{pattern.headline}</div>
                  <div className="ckp-body">{pattern.body}</div>
                  <div className="ckp-drill">Details →</div>
                </button>
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
            <div className="dec-row clickable-card" role="button" tabIndex={0} onClick={() => setInsightMetric('exec-ckp-3')} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setInsightMetric('exec-ckp-3')}}}>
              <div className="dec-bar" style={{ background: 'var(--red)' }} />
              <div className="dec-body">
                <div className="dec-title">Scale formal coaching on returns agents - refund confirmation protocol from Michael Naidoo benchmark</div>
                <span className="dec-type type-pol">Coaching</span>
              </div>
              <div className="dec-cost">{fmtUSDK(ltv.coachingProtectedAnnual)}</div>
            </div>
            <div className="dec-row clickable-card" role="button" tabIndex={0} onClick={() => setInsightMetric('exec-ckp-1')} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setInsightMetric('exec-ckp-1')}}}>
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
              onClick={() => setInsightMetric('exec-watch-zanele')}
            />
            <NBACard
              number={2}
              title="Make 30-day return policy card visible on every returns contact - eliminate policy misquote critical failures"
              kpis={['CF', 'CSAT']}
              impact="High"
              onClick={() => setInsightMetric('ccm-bp-1')}
            />
            <NBACard
              number={3}
              title="Scale Michael Naidoo returns close protocol across full returns driver squad"
              kpis={['FCR', 'AHT']}
              impact={fmtUSDK(ltv.totalProtectedAnnual)}
              onClick={() => setInsightMetric('ccm-bp-0')}
            />
          </div>
          <div className="bottom-card">
            <div className="bottom-top">
              <div className="bottom-label">Watch next week</div>
            </div>
            <button type="button" className="watch-row clickable-card" onClick={() => setInsightMetric('exec-watch-rcr')}>
              <div className="watch-dot" style={{ background: 'var(--red)' }} />
              <div>
                <div className="watch-title">Repeat contact rate 23% - nearly double 12% target</div>
                <div className="watch-proj">Returns drivers drive 31% RCR. Track whether documentation coaching reduces repeats below 15% by W10.</div>
              </div>
            </button>
            <button type="button" className="watch-row clickable-card" onClick={() => setInsightMetric('exec-watch-zanele')}>
              <div className="watch-dot" style={{ background: 'var(--amber)' }} />
              <div>
                <div className="watch-title">Zanele Ndlovu - 34% Returns FCR · 3 critical failures</div>
                <div className="watch-proj">Second formal coaching session open. Escalation avoidance remains the primary risk on returns drivers.</div>
              </div>
            </button>
            <button type="button" className="watch-row clickable-card" onClick={() => setInsightMetric('exec-watch-csat')}>
              <div className="watch-dot" style={{ background: 'var(--amber)' }} />
              <div>
                <div className="watch-title">CSAT 3.6/5 - 18% of contacts below 3</div>
                <div className="watch-proj">At 38% churn benchmark and $4,800 LTV, dissatisfied contacts represent {fmtUSDK(ltv.dissatisfiedRiskAnnual)} in revenue at risk annually. Retention recovery depends on returns coaching sustaining W6-W8 gains.</div>
              </div>
            </button>
          </div>
        </div>

        <FlowBar activePage="executive" />
      </div>

      <DriverDrilldownDrawer
        open={Boolean(driverCategory)}
        onClose={() => setDriverCategory(null)}
        category={driverCategory}
        l2Rows={l2Drivers}
      />

      <MetricInsightDrawer
        open={Boolean(insightMetric)}
        onClose={() => {
          setInsightMetric(null)
          setInsightOverrides(null)
        }}
        metricId={insightMetric}
        overrides={insightOverrides}
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

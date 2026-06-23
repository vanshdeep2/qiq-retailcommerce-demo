import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AgentTlModal from '../components/AgentTlModal'
import Nav from '../components/Nav'
import FlowBar from '../components/FlowBar'
import HealthStatCard from '../components/HealthStatCard'
import LedgerTable from '../components/LedgerTable'
import DrawerShell from '../components/DrawerShell'
import SparklineChart from '../components/charts/SparklineChart'
import SparkBarChart from '../components/charts/SparkBarChart'
import { CALLS_PILL, LIVE_LABEL } from '../data/executiveConstants'
import {
  BEST_PRACTICE_CARDS,
  CF_BAR_COLORS,
  CF_WEEKLY,
  COACHING_HEALTH_STATS,
  COACHING_LEDGER_ROWS,
  COACHING_LEDGER_SUMMARY,
  COACHING_WEEK_INDEX,
  HERO_CHIPS,
  HERO_STATS,
  PATTERN_CARDS,
  QUALITY_SUMMARY,
  RETURNS_AHT,
  RETURNS_FCR,
  TREND,
  WK_LABELS,
  getMetricsDrawerSections,
} from '../data/ccmConstants'
import { AGENT_SLUGS } from '../data/contactSearchConstants'
import { formatAht, fmtPct } from '../utils/format'
import '../styles/ccm.css'
import '../styles/teamlead.css'

const interventionWeek = WK_LABELS[COACHING_WEEK_INDEX]

const chartMarkerProps = {
  coachingPeriodBand: false,
  coachingWeekLabel: interventionWeek,
}

function DrawerTrendChart({ dataKey, color, formatValue }) {
  return (
    <div className="drawer-chart-wrap">
      <SparklineChart
        labels={WK_LABELS}
        data={TREND[dataKey]}
        color={color}
        height={130}
        formatValue={formatValue}
        {...chartMarkerProps}
      />
    </div>
  )
}

export default function CCM() {
  const navigate = useNavigate()
  const [metricsDrawerOpen, setMetricsDrawerOpen] = useState(false)
  const [agentTlModalOpen, setAgentTlModalOpen] = useState(false)
  const [agentTlModalSlug, setAgentTlModalSlug] = useState(null)
  const [calls, setCalls] = useState([])
  const drawerSections = getMetricsDrawerSections()

  useEffect(() => {
    fetch('/data/contact_search_data.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load contact data')
        return r.json()
      })
      .then(setCalls)
      .catch(() => setCalls([]))
  }, [])

  const openAgentModal = (slug) => {
    setAgentTlModalSlug(slug)
    setAgentTlModalOpen(true)
  }

  const formatDrawerValue = (section, v) => {
    if (section.dataKey === 'aht') return formatAht(v)
    if (section.dataKey === 'fcr') return `${v.toFixed(2)}%`
    return v.toFixed(2)
  }

  return (
    <>
      <Nav currentPage="ccm" liveLabel={LIVE_LABEL} callsPill={CALLS_PILL} />
      <div className="page">
        <div className="briefing-kicker">QiQ Operations Intelligence</div>
        <h1 className="briefing-title">CCM / Operations Director</h1>
        <div className="briefing-subtitle">
          8-week performance trends · Returns queue analysis · Coaching impact · May 2026
        </div>

        <div className="connector">Intelligence Summary</div>
        <div className="hero">
          <div className="hero-left">
            <div className="hero-eyebrow">QiQ Operations Intelligence · Week 8 of 8</div>
            <div className="hero-headline">
              Returns &amp; Refunds queue drove CSAT decline - W5 formal coaching intervention producing measurable recovery
            </div>
            <div className="hero-narrative">
              <p>
                Weeks 1–4: Returns &amp; Refunds showed rising AHT, climbing repeat contact rate, and falling FCR and CSAT. Daily micro coaching fired on returns agents but behaviour did not improve - agents continued closing calls without refund confirmation.
              </p>
              <p>
                Week 5: Four agents flagged for formal TL-led coaching after 7+ consecutive days of the same micro coaching trigger (no resolution confirmation on returns calls). This intervention point is marked on all trend charts.
              </p>
              <p>
                Weeks 6–8: Post-coaching recovery visible - Returns FCR rose from 37% at W5 to 59% by W8, CSAT partially recovered, repeat contact rate dropped, and micro coaching frequency on coached agents fell sharply.
              </p>
              <p>
                Returns &amp; Refunds remains the worst-performing queue on every KPI. Documentation Accuracy and Resolution &amp; Close are the lowest-scoring quality pillars on returns contacts.
              </p>
            </div>
            <div className="hero-chips">
              {HERO_CHIPS.map((chip) => (
                <div key={chip.text} className={`hero-chip ${chip.className}`}>
                  <span className="chip-dot" style={{ background: chip.dotColor }} />
                  {chip.text}
                </div>
              ))}
            </div>
          </div>
          <div className="hero-divider" />
          <div className="hero-right">
            <div className="hero-stats">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="hero-stat-row">
                  <span className="hero-stat-val">{stat.value}</span>
                  <span className="hero-stat-lbl">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="connector">Performance Trends · 8 Weeks</div>
        <div className="chart-section-head">
          <p className="section-sublabel">W5 formal coaching intervention marked on all charts</p>
          <button type="button" className="metrics-cta" onClick={() => setMetricsDrawerOpen(true)}>
            See all metrics →
          </button>
        </div>
        <div className="chart-grid">
          <button type="button" className="chart-card" onClick={() => setMetricsDrawerOpen(true)}>
            <div className="chart-top">
              <div className="chart-top-main">
                <div className="chart-title">Average Handle Time</div>
                <div className="chart-current val-amber">5m 48s</div>
                <div className="chart-meta">Target: 4m 30s</div>
                <div className="chart-var chg-amber">+28.9% vs target</div>
              </div>
              <span className="chart-drill">All metrics →</span>
            </div>
            <div className="chart-area">
              <SparklineChart
                labels={WK_LABELS}
                data={TREND.aht}
                color="#d97706"
                height={140}
                formatValue={formatAht}
                {...chartMarkerProps}
              />
            </div>
            <div className="chart-note">
              AHT elevated by Returns queue - improving post-W5 coaching on returns handle efficiency
            </div>
          </button>

          <button type="button" className="chart-card" onClick={() => setMetricsDrawerOpen(true)}>
            <div className="chart-top">
              <div className="chart-top-main">
                <div className="chart-title">First Contact Resolution</div>
                <div className="chart-current val-red">61.0%</div>
                <div className="chart-meta">Target: 78%</div>
                <div className="chart-var chg-red">-21.8% vs target</div>
              </div>
              <span className="chart-drill">All metrics →</span>
            </div>
            <div className="chart-area">
              <SparklineChart
                labels={WK_LABELS}
                data={TREND.fcr}
                color="#1a7a4a"
                height={140}
                formatValue={fmtPct}
                {...chartMarkerProps}
              />
            </div>
            <div className="chart-note">
              FCR trough at W5; recovery W6–W8 driven by formal coaching on four returns agents
            </div>
          </button>

          <div className="chart-card" id="kpi-returns-dual">
            <div className="chart-top">
              <div className="chart-top-main">
                <div className="chart-title">Returns &amp; Refunds · AHT + FCR</div>
                <div className="chart-current val-amber">7m 24s · 50% FCR</div>
                <div className="chart-meta">Worst-performing queue · Dual-axis trend</div>
              </div>
            </div>
            <div className="chart-area">
              <SparklineChart
                labels={WK_LABELS}
                data={RETURNS_AHT}
                color="#d97706"
                height={140}
                formatValue={formatAht}
                secondaryData={RETURNS_FCR}
                primaryName="AHT"
                secondaryName="FCR"
                secondaryFormatValue={fmtPct}
                {...chartMarkerProps}
              />
            </div>
            <div className="chart-note">
              Returns AHT peaked W5 at 8m 15s while FCR hit trough at 37% - both recovering post-formal coaching W6–W8
            </div>
          </div>

          <button
            type="button"
            className="chart-card"
            onClick={() => navigate('/search?criticalOnly=true')}
          >
            <div className="chart-top">
              <div className="chart-top-main">
                <div className="chart-title">Critical Failures per Week</div>
                <div className="chart-current val-amber">9</div>
              </div>
              <span className="chart-drill">View contacts →</span>
            </div>
            <div className="chart-area">
              <SparkBarChart
                labels={WK_LABELS}
                data={CF_WEEKLY}
                barColors={CF_BAR_COLORS}
                height={140}
                {...chartMarkerProps}
              />
            </div>
            <div className="chart-note">
              85 critical failures W1–W4 vs 26 W6–W8 - policy misquotes, no resolution confirmation, and verification failures cluster on returns
            </div>
          </button>

          <div className="pattern-card pattern-card-green qi-summary-card">
            <div className="pattern-top">
              <div className="pattern-title">Quality Improvement Summary</div>
            </div>
            {QUALITY_SUMMARY.map((item) => (
              <div key={item.label} className="qi-stat-row">
                <div className="qi-stat-val">{item.value}</div>
                <div className="qi-stat-lbl">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="connector">Coaching Health · Week 8</div>
        <div className="coaching-health coaching-health--compact">
          {COACHING_HEALTH_STATS.map((stat) => (
            <HealthStatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="connector">Coaching Impact Ledger · 8-Week Period</div>
        <p className="section-sublabel">Formal coaching sessions from W5 intervention through recovery in W6–W8</p>
        <LedgerTable
          columns={['Agent', 'Issue Identified', 'Coaching Topic', 'Coaching Deployed', 'Outcome (W6–W8)', 'Status']}
          summary={COACHING_LEDGER_SUMMARY}
          rows={COACHING_LEDGER_ROWS.map((row) => (
            <tr key={row.agent + row.topic}>
              <td>
                <button
                  type="button"
                  className="ledger-agent-link"
                  onClick={() => openAgentModal(AGENT_SLUGS[row.agent])}
                >
                  {row.agent}
                </button>
              </td>
              <td>{row.issue}</td>
              <td>{row.topic}</td>
              <td>{row.deployed}</td>
              <td>{row.outcome}</td>
              <td className={row.statusCell ? 'status-cell' : undefined}>
                {row.badges.map((badge) => (
                  <span key={badge.text} className={badge.className}>
                    {badge.text}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        />

        <div className="connector">Systemic Patterns Identified · Week 8</div>
        <p className="section-sublabel">Issues that span multiple KPIs and require structural or team-level intervention</p>
        <div className="pattern-grid">
          {PATTERN_CARDS.map((card) => (
            <div key={card.title} className={`pattern-card pattern-card-${card.variant}`}>
              <div className="pattern-top">
                <div className="pattern-title">{card.title}</div>
                <span className="pattern-level">{card.level}</span>
              </div>
              <div className="pattern-body">{card.body}</div>
              <div className="pattern-tags">
                {card.tags.map((tag) => (
                  <span key={tag.text} className={tag.className}>
                    {tag.text}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="connector">Validated Best Practices · Week 8</div>
        <div className="bp-grid">
          {BEST_PRACTICE_CARDS.map((card) => (
            <div key={card.title} className="bp-card">
              <div className="bp-title">{card.title}</div>
              <div className="bp-evidence">{card.evidence}</div>
              <div className="bp-agents">{card.agents}</div>
              <div className="bp-rec">{card.rec}</div>
            </div>
          ))}
        </div>

        <FlowBar activePage="ccm" />
      </div>

      <DrawerShell
        open={metricsDrawerOpen}
        onClose={() => setMetricsDrawerOpen(false)}
        title="Performance Trends - All Metrics"
        subtitle="8-week trends with W5 formal coaching intervention marked on all charts."
      >
        {drawerSections.map((section) => (
          <div key={section.id} className="drawer-section" id={section.id}>
            <div className="drawer-kpi-header">
              <div>
                <div className="drawer-section-lbl">{section.label}</div>
                <div className={`drawer-kpi-val ${section.valueClass}`}>{section.value}</div>
                <div className="drawer-kpi-sub">{section.sub}</div>
                {section.change && (
                  <div className={`drawer-kpi-chg ${section.changeClass}`}>{section.change}</div>
                )}
              </div>
              <div className="drawer-w5-badge">Week 8</div>
            </div>
            <DrawerTrendChart
              dataKey={section.dataKey}
              color={section.color}
              formatValue={(v) => formatDrawerValue(section, v)}
            />
            {section.alert && <div className="alert-box alert-amber">{section.alert}</div>}
            <div className="drawer-note">{section.note}</div>
          </div>
        ))}
      </DrawerShell>

      <AgentTlModal
        open={agentTlModalOpen}
        onClose={() => {
          setAgentTlModalOpen(false)
          setAgentTlModalSlug(null)
        }}
        slug={agentTlModalSlug}
        calls={calls}
      />
    </>
  )
}

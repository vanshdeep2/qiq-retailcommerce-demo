import { useNavigate } from 'react-router-dom'
import { AGENTS } from '../data/agents'
import ModalShell from './ModalShell'
import SparklineChart from './charts/SparklineChart'
import SparkBarChart from './charts/SparkBarChart'
import { getMetricInsight } from '../data/metricInsightContent'
import { CF_BAR_COLORS, COACHING_WEEK_INDEX, WK_LABELS } from '../data/ccmConstants'
import { fmtUSDK } from '../utils/format'
import '../styles/operations.css'

const CONTRIBUTORS_LABELS = {
  kpi: 'Performance drivers',
  agent: 'Coaching history',
  coaching: 'Agent recovery arcs',
  'best-practice': 'Agents adopting',
  ltv: 'Revenue breakdown',
  cf: 'Failure type breakdown',
}

const AGENT_CF_TYPE = {
  'pieter-botha': 'Policy misquote',
  'zanele-ndlovu': 'Escalation avoidance',
  'busisiwe-maseko': 'Resolution confirmation',
  'lerato-nkosi': 'Resolution confirmation',
  'ayanda-mbeki': 'Verification failure',
  'sipho-khumalo': 'Return window confirmation',
}

function getAgentCfType(slug) {
  return AGENT_CF_TYPE[slug] || 'Resolution confirmation gaps'
}

function mergeInsight(metricId, overrides) {
  const base = getMetricInsight(metricId)
  if (!base) return null
  return {
    ...base,
    ...overrides,
    contributors: overrides?.contributors ?? base.contributors,
    ltvItems: overrides?.ltvItems ?? base.ltvItems,
    steps: overrides?.steps ?? base.steps,
    beforeAfter: overrides?.beforeAfter ?? base.beforeAfter,
    actionLinks: overrides?.actionLinks ?? base.actionLinks,
  }
}

function TrendSection({ insight }) {
  if (!insight.trendData?.length) return null

  const chartProps = {
    labels: insight.trendLabels,
    height: insight.chartType === 'bar' ? 140 : 130,
    coachingWeekLabel: insight.showCoachingMarker ? WK_LABELS[COACHING_WEEK_INDEX] : undefined,
  }

  return (
    <div className="drawer-section">
      <div className="drawer-section-lbl">{insight.trendLabel || '8-week trend'}</div>
      <div className="drawer-chart-wrap">
        {insight.chartType === 'bar' ? (
          <SparkBarChart
            {...chartProps}
            data={insight.trendData}
            barColors={insight.barColors || CF_BAR_COLORS}
          />
        ) : (
          <SparklineChart
            {...chartProps}
            data={insight.trendData}
            color={insight.trendColor}
            formatValue={insight.formatTrend}
            secondaryData={insight.secondaryTrendData}
            primaryName={insight.primaryTrendName}
            secondaryName={insight.secondaryTrendName}
            secondaryFormatValue={insight.secondaryFormatTrend}
          />
        )}
      </div>
    </div>
  )
}

function ContributorsSection({ insight }) {
  if (!insight.contributors?.length) return null
  const label = insight.contributorsLabel || CONTRIBUTORS_LABELS[insight.variant] || 'Top contributors'

  return (
    <div className="drawer-section">
      <div className="drawer-section-lbl">{label}</div>
      <table className="metric-contributors-table">
        <thead>
          <tr>
            <th>{insight.contributorsCol1 || 'Name'}</th>
            <th>{insight.contributorsCol2 || 'Detail'}</th>
          </tr>
        </thead>
        <tbody>
          {insight.contributors.map((c) => (
            <tr key={c.name}>
              <td>{c.name}</td>
              <td>{c.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function KpiHeader({ insight }) {
  if (!insight.value) return null
  return (
    <div className="drawer-section metric-insight-kpi-header">
      <div className="metric-insight-kpi-row">
        <div>
          <div className="drawer-section-lbl">{insight.kpiLabel || 'Current value'}</div>
          <div className={`metric-insight-kpi-val ${insight.valueClass || ''}`}>{insight.value}</div>
          {insight.target && <div className="metric-insight-kpi-target">{insight.target}</div>}
        </div>
        {insight.delta && (
          <div className={`metric-insight-kpi-delta ${insight.deltaClass || ''}`}>{insight.delta}</div>
        )}
      </div>
    </div>
  )
}

function AgentHeader({ insight }) {
  return (
    <div className="drawer-section metric-insight-agent-header">
      <div className="metric-insight-agent-row">
        <div>
          <div className="metric-insight-agent-name">{insight.agentName}</div>
          <div className="metric-insight-agent-meta">{insight.agentMeta}</div>
        </div>
        {insight.agentStatus && (
          <span className={`badge ${insight.agentBadgeClass || 'badge-amber'}`}>{insight.agentStatus}</span>
        )}
      </div>
      {insight.agentMetrics && <div className="metric-insight-agent-metrics">{insight.agentMetrics}</div>}
    </div>
  )
}

function CoachingCompare({ insight }) {
  if (!insight.beforeAfter) return null
  const { before, after, beforeLabel, afterLabel } = insight.beforeAfter
  return (
    <div className="drawer-section metric-insight-compare">
      <div className="metric-insight-compare-grid">
        <div className="metric-insight-compare-cell">
          <div className="drawer-section-lbl">{beforeLabel || 'Before W5'}</div>
          <div className="metric-insight-compare-val val-red">{before}</div>
        </div>
        <div className="metric-insight-compare-arrow">→</div>
        <div className="metric-insight-compare-cell">
          <div className="drawer-section-lbl">{afterLabel || 'After W8'}</div>
          <div className="metric-insight-compare-val val-green">{after}</div>
        </div>
      </div>
    </div>
  )
}

function BestPracticeSteps({ insight }) {
  if (!insight.steps?.length) return null
  return (
    <div className="drawer-section">
      <div className="drawer-section-lbl">Protocol steps</div>
      <ol className="metric-insight-steps">
        {insight.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      {insight.evidenceQuote && (
        <blockquote className="metric-insight-evidence">{insight.evidenceQuote}</blockquote>
      )}
    </div>
  )
}

function LtvSummary({ insight }) {
  if (!insight.ltvItems?.length) return null
  return (
    <div className="drawer-section">
      <div className="metric-insight-ltv-grid">
        {insight.ltvItems.map((item) => (
          <div key={item.label} className="metric-insight-ltv-item">
            <div className="metric-insight-ltv-label">{item.label}</div>
            <div className={`metric-insight-ltv-val ${item.valueClass || ''}`}>{item.value}</div>
            {item.sub && <div className="metric-insight-ltv-sub">{item.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

function ActionLinksSection({ links, onClose }) {
  const navigate = useNavigate()
  if (!links?.length) return null

  return (
    <div className="drawer-section">
      <div className="drawer-section-lbl">Related calls</div>
      <div className="metric-insight-actions">
        {links.map((link) => (
          <button
            key={link.to}
            type="button"
            className={`metric-insight-action-link${link.primary ? ' metric-insight-action-link--primary' : ''}`}
            onClick={() => {
              onClose()
              navigate(link.to)
            }}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function MetricInsightDrawer({ open, onClose, metricId, overrides }) {
  const insight = mergeInsight(metricId, overrides)
  if (!insight) return null

  const variant = insight.variant || 'kpi'

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={insight.title}
      subtitle={insight.subtitle}
      panelClassName="metric-insight-drawer"
      size="sm"
    >
      {variant === 'agent' && <AgentHeader insight={insight} />}

      {variant === 'kpi' && <KpiHeader insight={insight} />}

      {variant === 'coaching' && <CoachingCompare insight={insight} />}

      {variant === 'ltv' && <LtvSummary insight={insight} />}

      <div className="drawer-section">
        <div className="drawer-section-lbl">
          {variant === 'best-practice' ? 'Why this works' : 'Root cause analysis'}
        </div>
        <p className="drawer-rootcause">{insight.rootCause}</p>
      </div>

      {variant === 'best-practice' && <BestPracticeSteps insight={insight} />}

      <TrendSection insight={insight} />

      {variant !== 'ltv' && <ContributorsSection insight={insight} />}

      {insight.recommendedAction && (
        <div className="drawer-section">
          <div className="drawer-section-lbl">Recommended action</div>
          <p className="drawer-rootcause">{insight.recommendedAction}</p>
        </div>
      )}

      <ActionLinksSection links={insight.actionLinks} onClose={onClose} />
    </ModalShell>
  )
}

export function buildAgentInsightOverrides(metricId, agent) {
  const base = getMetricInsight(metricId)
  if (!base) return null

  const delta = agent.qa_w5 - agent.qa_w1
  const deltaText = `${delta >= 0 ? '+' : ''}${delta.toFixed(1)} pts W1 to W8`

  if (metricId === 'agent-qa') {
    return {
      variant: 'agent',
      title: `QA Score · ${agent.name}`,
      subtitle: `Week 8 · ${agent.status}`,
      agentName: agent.name,
      agentStatus: agent.status,
      agentBadgeClass: agent.status === 'Benchmark' ? 'badge-navy' : agent.status === 'Action Needed' ? 'badge-red' : agent.status === 'Watch' ? 'badge-amber' : 'badge-green',
      agentMeta: `${agent.role} · Team: ${agent.team}`,
      agentMetrics: `QA W8: ${agent.qa_w5.toFixed(1)} · W1: ${agent.qa_w1.toFixed(1)} · PA: ${agent.pa.toFixed(1)}%`,
      rootCause: agent.insight,
      trendData: agent.qa_series,
      trendLabels: WK_LABELS,
      trendColor: delta >= 0 ? '#1a7a4a' : '#c0392b',
      formatTrend: (v) => v.toFixed(1),
      showCoachingMarker: true,
      trendLabel: 'QA score · 8 weeks',
      contributors: [
        { name: 'Resolution & Close', detail: agent.rr >= 75 ? 'Strong pillar' : 'Coaching focus' },
        { name: 'Process Adherence', detail: `${agent.pa.toFixed(1)}%` },
        { name: 'Formal coaching', detail: delta >= 15 ? 'W5 intervention · recovering' : 'Steady performance' },
      ],
      contributorsLabel: 'Quality pillars',
    }
  }

  if (metricId === 'agent-fcr') {
    return {
      variant: 'kpi',
      title: `Returns FCR · ${agent.name}`,
      subtitle: `Resolution rate on returns drivers · Week 8`,
      value: `${agent.rr.toFixed(1)}%`,
      valueClass: agent.rr >= 75 ? 'val-green' : agent.rr >= 55 ? 'val-amber' : 'val-red',
      target: 'Benchmark: Michael Naidoo · 84%',
      delta: deltaText,
      deltaClass: delta >= 0 ? 'chg-green' : 'chg-red',
      rootCause: `${agent.name} resolves ${agent.rr.toFixed(1)}% of returns contacts on first contact. ${agent.rr < 55 ? 'Escalation criteria and refund confirmation are the primary coaching gaps.' : agent.rr >= 80 ? 'Performance matches team benchmark workflow.' : 'Post-W5 coaching is moving resolution rate toward team target.'}`,
      contributors: [
        { name: agent.name, detail: `${agent.rr.toFixed(1)}% returns FCR` },
        { name: 'Team avg W8', detail: '59%' },
        { name: 'Michael Naidoo', detail: '84% benchmark' },
      ],
    }
  }

  if (metricId === 'agent-pa') {
    return {
      variant: 'kpi',
      title: `Process Adherence · ${agent.name}`,
      subtitle: 'Week 8 · verification and policy compliance',
      value: `${agent.pa.toFixed(1)}%`,
      valueClass: agent.pa >= 80 ? 'val-green' : agent.pa >= 65 ? 'val-amber' : 'val-red',
      target: 'Team target: 80%',
      rootCause: `${agent.name} adheres to returns protocol on ${agent.pa.toFixed(1)}% of scored contacts. ${agent.pa < 70 ? 'Documentation and verification steps need reinforcement before close.' : 'Protocol adherence is supporting FCR recovery.'}`,
      contributors: [
        { name: 'Verification', detail: agent.pa >= 75 ? 'Consistent' : 'Gap on repeat contacts' },
        { name: 'Policy communication', detail: agent.cf > 0 ? '1 CF this period' : 'No policy misquotes' },
        { name: 'Status', detail: agent.status },
      ],
    }
  }

  if (metricId === 'agent-cf') {
    const cfType = getAgentCfType(agent.slug)
    return {
      variant: 'cf',
      title: `Critical Failures · ${agent.name}`,
      subtitle: `${agent.cf} critical failure${agent.cf === 1 ? '' : 's'} this period`,
      rootCause: agent.cf > 0
        ? `${agent.name} has ${agent.cf} critical failure${agent.cf === 1 ? '' : 's'} on returns drivers — primarily ${cfType}.`
        : `${agent.name} has zero critical failures this period. Refund confirmation and policy accuracy are consistent.`,
      trendData: agent.cf > 0 ? [agent.cf, agent.cf, agent.cf, agent.cf, Math.max(0, agent.cf - 1), 1, 0, 0].slice(0, 8) : [0, 0, 0, 0, 0, 0, 0, 0],
      trendLabels: WK_LABELS,
      chartType: 'bar',
      barColors: CF_BAR_COLORS,
      formatTrend: (v) => String(Math.round(v)),
      trendLabel: 'Critical failures per week',
      contributors: agent.cf > 0
        ? [
            { name: agent.name, detail: `${agent.cf} total CFs` },
            { name: 'Primary type', detail: cfType },
            { name: 'TL action', detail: agent.team },
          ]
        : [
            { name: agent.name, detail: 'Zero CFs W6–W8' },
            { name: 'Protocol', detail: 'Refund confirmation consistent' },
          ],
    }
  }

  return null
}

export function buildAlertAgentInsight(agent) {
  const slug = agent.slug
  const name = agent.name
  const agentRecord = slug ? AGENTS[slug] : null

  return {
    variant: 'agent',
    title: `Agent Attention · ${name}`,
    subtitle: agent.status,
    agentName: name,
    agentStatus: agent.status,
    agentBadgeClass: agent.badgeClass,
    agentMetrics: agent.metrics,
    rootCause: agent.insight,
    recommendedAction: agent.action,
    trendData: agentRecord?.qa_series ?? [70, 70, 70, 70, 70, 70, 70, 70],
    trendLabels: WK_LABELS,
    trendColor: agent.badgeClass === 'badge-red' ? '#c0392b' : '#1a7a4a',
    formatTrend: (v) => v.toFixed(1),
    showCoachingMarker: true,
    trendLabel: 'QA score · 8 weeks',
    contributors: [
      { name: name, detail: agent.metrics.split('·')[0].trim() },
      { name: 'Coaching topic', detail: agent.action.split('.')[0] },
      { name: 'TL', detail: 'Kagiso de Villiers' },
    ],
    contributorsLabel: 'Agent snapshot',
  }
}

export function buildLtvNetInsight(ltv) {
  return {
    ltvItems: [
      { label: 'Revenue at risk', value: fmtUSDK(ltv.totalRisk), valueClass: 'val-red', sub: `${fmtUSDK(ltv.totalRiskAnnual)} annualised` },
      { label: 'LTV protected', value: fmtUSDK(ltv.totalProtected), valueClass: 'val-green', sub: `${fmtUSDK(ltv.totalProtectedAnnual)} annualised` },
      { label: 'Net surfaced', value: fmtUSDK(ltv.totalSurfacedPeriod), sub: `${fmtUSDK(ltv.totalSurfacedAnnual)} annualised` },
    ],
  }
}

import { useEffect, useState } from 'react'
import MetricInsightDrawer, { buildAgentInsightOverrides } from '../components/MetricInsightDrawer'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import CoachingQueueList from '../components/CoachingQueueList'
import Nav from '../components/Nav'
import FlowBar from '../components/FlowBar'
import NotesThread from '../components/NotesThread'
import SparkQaChart from '../components/charts/SparkQaChart'
import { AGENT_ORDER, AGENTS, COACHING_WEEK_INDEX, DEFAULT_SLUG, WK_LABELS } from '../data/agents'
import { CALLS_PILL, LIVE_LABEL } from '../data/executiveConstants'
import {
  formatDelta,
  metricColor,
  statusBadgeClass,
} from '../utils/format'
import '../styles/agent.css'

export default function Agent() {
  const { agentSlug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [insightMetric, setInsightMetric] = useState(null)
  const [insightOverrides, setInsightOverrides] = useState(null)
  const isTlMode = searchParams.get('from') === 'teamlead'
  const slug = agentSlug && AGENTS[agentSlug] ? agentSlug : DEFAULT_SLUG
  const agent = AGENTS[slug]

  useEffect(() => {
    if (agentSlug && !AGENTS[agentSlug]) {
      navigate('/teamlead', { replace: true })
    }
  }, [agentSlug, navigate])

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (hash.startsWith('agent-')) {
      const hashSlug = hash.slice('agent-'.length)
      if (AGENTS[hashSlug] && hashSlug !== slug) {
        const from = isTlMode ? '?from=teamlead' : ''
        navigate(`/agent/${hashSlug}${from}${location.hash}`, { replace: true })
      }
    }
  }, [location.hash, slug, navigate, isTlMode])

  const openAgentInsight = (metricId) => {
    setInsightMetric(metricId)
    setInsightOverrides(buildAgentInsightOverrides(metricId, agent))
  }

  const delta = formatDelta(agent.qa_w5 - agent.qa_w1)
  const cfCls = agent.cf > 0 ? 'val-red' : 'val-green'
  const coachingLabel = WK_LABELS[COACHING_WEEK_INDEX]

  const roleSelect = (
    <label className="nav-role-wrap">
      <span className="nav-role-label">Viewing as:</span>
      <select
        className="nav-role-select"
        aria-label="View role"
        value="agent"
        onChange={(e) => {
          if (e.target.value === 'teamlead') navigate('/teamlead')
        }}
      >
        <option value="agent">Agent</option>
        <option value="teamlead">Team Leader</option>
      </select>
    </label>
  )

  return (
    <>
      <Nav
        currentPage="agent"
        liveLabel={LIVE_LABEL}
        callsPill={CALLS_PILL}
        navExtra={roleSelect}
      />
      <div className="page">
        <header className="agent-header" id={`agent-${slug}`}>
          <div className="agent-header-toolbar">
            {isTlMode ? (
              <Link to="/teamlead" className="back-btn">
                ← Back to Team Leader
              </Link>
            ) : (
              <div className="agent-select-wrap">
                <select
                  className="agent-select"
                  aria-label="Select agent"
                  value={slug}
                  onChange={(e) => navigate(`/agent/${e.target.value}`)}
                >
                  {AGENT_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {AGENTS[s].name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div>
            <h1 className="agent-name">{agent.name}</h1>
            <div className="agent-meta">
              <span>{agent.role}</span>
              <span className="agent-meta-sep">·</span>
              <span>
                Team lead: <strong>{agent.team}</strong>
              </span>
              <span className="agent-meta-sep">·</span>
              <span className="header-chip">
                QA W8 <strong className={metricColor(agent.qa_w5)}>{agent.qa_w5.toFixed(1)}</strong>
              </span>
              <span className="header-chip">
                PA <strong className={metricColor(agent.pa)}>{agent.pa.toFixed(1)}%</strong>
              </span>
              <span className="header-chip">
                RR <strong className={metricColor(agent.rr)}>{agent.rr.toFixed(1)}%</strong>
              </span>
              <span className="header-chip">
                CF <strong className={cfCls}>{agent.cf}</strong>
              </span>
            </div>
          </div>
        </header>

        <div className="perf-card">
          <div className="perf-metrics">
            <button type="button" className="perf-metric-main clickable-card" onClick={() => openAgentInsight('agent-qa')}>
              <div className="perf-metric-lbl">QA Score · Week 8</div>
              <div className={`perf-metric-val ${metricColor(agent.qa_w5)}`}>
                {agent.qa_w5.toFixed(1)}
              </div>
              <div className="perf-metric-sub">
                Week 1: {agent.qa_w1.toFixed(1)} · <span className={delta.cls}>{delta.text}</span>
              </div>
              <div className="ckp-drill">Details →</div>
            </button>
            <div className="perf-metric-grid">
              <button type="button" className="perf-metric-item clickable-card" onClick={() => openAgentInsight('agent-pa')}>
                <div className="perf-item-lbl">Process Adherence</div>
                <div className={`perf-item-val ${metricColor(agent.pa)}`}>{agent.pa.toFixed(1)}%</div>
              </button>
              <button type="button" className="perf-metric-item clickable-card" onClick={() => openAgentInsight('agent-fcr')}>
                <div className="perf-item-lbl">Resolution Rate</div>
                <div className={`perf-item-val ${metricColor(agent.rr)}`}>{agent.rr.toFixed(1)}%</div>
              </button>
              <button type="button" className="perf-metric-item clickable-card" onClick={() => openAgentInsight('agent-cf')}>
                <div className="perf-item-lbl">Critical Failures</div>
                <div className={`perf-item-val ${cfCls}`}>{agent.cf}</div>
              </button>
              <button type="button" className="perf-metric-item perf-status-item clickable-card" onClick={() => openAgentInsight('agent-fcr')}>
                <div className="perf-item-lbl">Status</div>
                <span className={`badge ${statusBadgeClass(agent.status)}`}>{agent.status}</span>
              </button>
            </div>
          </div>
          <button type="button" className="perf-spark-wrap clickable-card" onClick={() => openAgentInsight('agent-qa')}>
            <div className="perf-spark-lbl">QA trend · 8 weeks</div>
            <div className="perf-spark-chart">
              <SparkQaChart
                labels={WK_LABELS}
                data={agent.qa_series}
                coachingWeekLabel={coachingLabel}
                height={120}
              />
            </div>
          </button>
        </div>

        <MetricInsightDrawer
          open={Boolean(insightMetric)}
          onClose={() => {
            setInsightMetric(null)
            setInsightOverrides(null)
          }}
          metricId={insightMetric}
          overrides={insightOverrides}
        />

        <div className="connector">Daily Micro-Coaching Log</div>
        <p className="section-sublabel">Automated QiQ nudges from your recent contacts · dated log</p>
        <CoachingQueueList
          coaching={agent.coaching}
          microLog={agent.micro_coaching_log}
          idPrefix={`queue-${slug}`}
        />

        <div className="connector">QiQ Performance Insight · Week 8</div>
        <div className="insight-card">{agent.insight}</div>

        <div className="connector">Coaching Thread</div>
        <p className="section-sublabel">Notes between you and {agent.team}</p>
        <NotesThread notes={agent.notes} teamLeadName={agent.team} />

        <FlowBar activePage="agent" />
      </div>
    </>
  )
}

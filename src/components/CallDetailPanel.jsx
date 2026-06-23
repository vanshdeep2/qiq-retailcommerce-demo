import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AGENTS } from '../data/agents'
import { AGENT_SLUGS, PASS_FAIL_QS, Q_NAMES } from '../data/contactSearchConstants'
import {
  getMetBadge,
  getSectionBarClass,
  getWeekIndex,
  parseTranscript,
} from '../utils/contactSearch'

const TABS = [
  { id: 'summary', label: 'Summary' },
  { id: 'qa', label: 'QA Scorecard' },
  { id: 'transcript', label: 'Transcript' },
  { id: 'agent', label: 'Agent Context' },
]

function SummaryTab({ call }) {
  return (
    <div className="detail-tab-content">
      <p className="detail-narrative">{call.narrative_summary}</p>

      {call.timeline?.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Timeline</div>
          <ul className="detail-timeline">
            {call.timeline.map((item, i) => (
              <li key={i}>{typeof item === 'string' ? item : item.text || JSON.stringify(item)}</li>
            ))}
          </ul>
        </div>
      )}

      {call.key_strengths?.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Key Strengths</div>
          <div className="detail-chips">
            {call.key_strengths.map((s) => (
              <span key={s} className="detail-chip detail-chip-green">{s}</span>
            ))}
          </div>
        </div>
      )}

      {call.key_gaps?.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Key Gaps</div>
          <div className="detail-chips">
            {call.key_gaps.map((g) => (
              <span key={g} className="detail-chip detail-chip-red">{g}</span>
            ))}
          </div>
        </div>
      )}

      <div className="detail-stat-chips">
        <span className="detail-stat-chip">
          FCR: {call.fcr_resolved ? 'Resolved' : 'Not resolved'}
        </span>
        <span className="detail-stat-chip">
          CSAT: {call.predicted_csat_label || '-'}
        </span>
        <span className="detail-stat-chip">
          NPS: {call.predicted_nps_score ?? '-'}
        </span>
      </div>
    </div>
  )
}

function QaScorecardTab({ call }) {
  const [expandedQuestion, setExpandedQuestion] = useState(null)

  return (
    <div className="detail-tab-content">
      <div className="qa-score-header">
        <div className="qa-score-large">
          {call.qa_score != null ? call.qa_score.toFixed(1) : '-'}
        </div>
        <span className={`qa-pass-badge ${call.qa_pass ? 'qa-pass-yes' : 'qa-pass-no'}`}>
          {call.qa_pass ? 'PASS' : 'FAIL'}
        </span>
      </div>

      {call.auto_fail_reasons?.length > 0 && (
        <div className="qa-autofail-alert">
          <div className="qa-autofail-title">Auto-fail reasons</div>
          <ul>
            {call.auto_fail_reasons.map((r) => (
              <li key={r}>{r.replace(/_/g, ' ')}</li>
            ))}
          </ul>
        </div>
      )}

      {call.section_scores?.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Section Scores</div>
          {call.section_scores.map((s) => (
            <div key={s.section} className="section-bar-row">
              <div className="section-bar-meta">
                <span>{s.section}</span>
                <span>{s.score_pct.toFixed(1)}%</span>
              </div>
              <div className="section-bar-track">
                <div
                  className={`section-bar-fill ${getSectionBarClass(s.score_pct)}`}
                  style={{ width: `${Math.min(s.score_pct, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {call.question_evaluations?.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">Question Evaluations</div>
          <div className="question-list">
            {call.question_evaluations.map((q) => {
              const badge = getMetBadge(q)
              const isPassFail = PASS_FAIL_QS.includes(q.question_id)
              const isExpanded = expandedQuestion === q.question_id
              const isFail = q.applicable !== false && q.llm_score_awarded === 0
              const isNa = q.applicable === false

              return (
                <div
                  key={q.question_id}
                  className={`question-row ${isFail ? 'question-row-fail' : ''} ${isNa ? 'question-row-na' : ''}`}
                >
                  <button
                    type="button"
                    className="question-row-head"
                    onClick={() => setExpandedQuestion(isExpanded ? null : q.question_id)}
                  >
                    <span className="question-id">{q.question_id.toUpperCase()}</span>
                    <span className="question-name">{Q_NAMES[q.question_id] || q.question_id}</span>
                    <span className={`q-badge ${badge.className}`}>{badge.label}</span>
                    {isPassFail && (
                      <span className="question-pf-label">
                        {q.applicable === false ? 'N/A' : q.llm_score_awarded === 1 ? 'Pass' : 'Fail'}
                      </span>
                    )}
                    <span className="question-chevron">{isExpanded ? '▾' : '▸'}</span>
                  </button>
                  {isExpanded && (
                    <div className="question-row-body">
                      <p>{q.reasoning}</p>
                      {q.structured_evidence?.length > 0 && (
                        <div className="question-evidence">
                          {q.structured_evidence.map((ev, i) => (
                            <blockquote key={i}>
                              <span className="evidence-speaker">{ev.speaker}:</span> {ev.quote}
                            </blockquote>
                          ))}
                        </div>
                      )}
                      {q.na_reason && <p className="question-na-reason">N/A: {q.na_reason}</p>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function TranscriptTab({ call }) {
  const lines = useMemo(() => parseTranscript(call.transcript), [call.transcript])

  return (
    <div className="detail-tab-content">
      <div className="transcript-box">
        {lines.map((line, i) => (
          <div key={i} className={`transcript-line transcript-${line.role}`}>
            {line.text}
          </div>
        ))}
      </div>
    </div>
  )
}

function AgentContextTab({ call }) {
  const slug = AGENT_SLUGS[call.agent_name]
  const agent = slug ? AGENTS[slug] : null
  const weekIdx = getWeekIndex(call.call_date)
  const weekQa = agent?.qa_series?.[weekIdx]

  return (
    <div className="detail-tab-content">
      <div className="agent-context-card">
        <div className="agent-context-name">{call.agent_name}</div>
        {weekQa != null && (
          <div className="agent-context-qa">
            Week {weekIdx + 1} QA score: <strong>{weekQa.toFixed(1)}</strong>
          </div>
        )}
        {agent && (
          <div className="agent-context-status">
            Status: {agent.status}
          </div>
        )}
        {slug && (
          <Link to={`/agent/${slug}`} className="agent-context-link">
            View full agent profile →
          </Link>
        )}
      </div>
    </div>
  )
}

export default function CallDetailPanel({ call, activeTab, setActiveTab, hideHeader = false }) {
  return (
    <div className="call-detail-panel">
      {!hideHeader && (
        <div className="detail-panel-head">
          <div>
            <div className="detail-call-id">{call.call_id}</div>
            <div className="detail-call-meta">
              {call.merchant_name} · Order {call.merchant_contact} · {call.agent_name} · {call.call_date} · {call.call_category}
            </div>
          </div>
        </div>
      )}

      <div className="detail-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`detail-tab ${activeTab === tab.id ? 'detail-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'summary' && <SummaryTab call={call} />}
      {activeTab === 'qa' && <QaScorecardTab call={call} />}
      {activeTab === 'transcript' && <TranscriptTab call={call} />}
      {activeTab === 'agent' && <AgentContextTab call={call} />}
    </div>
  )
}

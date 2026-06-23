import { useNavigate } from 'react-router-dom'
import {
  formatQaScoreDisplay,
  getQaScoreCellClass,
} from '../utils/contactSearch'
import { formatDate } from '../utils/format'

export default function AgentCallsTable({ calls, agentName, onReviewClick, limit = 20 }) {
  const navigate = useNavigate()

  const agentCalls = calls
    .filter((c) => c.agent_name === agentName)
    .sort((a, b) => {
      const aScore = a.qa_score ?? Infinity
      const bScore = b.qa_score ?? Infinity
      return aScore - bScore
    })

  const displayCalls = limit == null ? agentCalls : agentCalls.slice(0, limit)
  const title =
    limit == null
      ? `All scored calls · ${agentCalls.length} total · lowest QA first`
      : 'Scored calls · lowest QA first'

  const handleReview = (callId, e) => {
    e?.stopPropagation?.()
    if (onReviewClick) {
      onReviewClick(callId)
    } else {
      navigate(`/search?call=${callId}`)
    }
  }

  return (
    <div className="agent-overview-calls">
      <div className="agent-overview-calls-title">{title}</div>
      <div className="agent-overview-table-wrap">
        <table className="agent-overview-table">
          <thead>
            <tr>
              <th>Call ID</th>
              <th>Date</th>
              <th>Category</th>
              <th>QA Score</th>
              <th>FCR</th>
              <th>Critical Failure</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {displayCalls.length === 0 ? (
              <tr>
                <td colSpan={7} className="agent-overview-empty">
                  No scored calls found for this agent.
                </td>
              </tr>
            ) : (
              displayCalls.map((call) => (
                <tr key={call.call_id}>
                  <td>{call.call_id}</td>
                  <td>{formatDate(call.call_date)}</td>
                  <td>{call.call_category}</td>
                  <td>
                    <span
                      className={`qa-pill ${getQaScoreCellClass(call.qa_score, call.qa_pass)}`}
                    >
                      {formatQaScoreDisplay(call.qa_score, call.qa_pass)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={call.fcr_resolved ? 'fcr-tick' : 'fcr-cross'}
                      aria-label={call.fcr_resolved ? 'Resolved' : 'Not resolved'}
                    >
                      {call.fcr_resolved ? '✓' : '✕'}
                    </span>
                  </td>
                  <td>
                    {call.critical_failure ? (
                      <span className="cf-badge">CF</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="overview-review-btn"
                      onClick={(e) => handleReview(call.call_id, e)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

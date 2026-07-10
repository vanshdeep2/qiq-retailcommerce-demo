import { useState } from 'react'
import HealthStatCard from './HealthStatCard'
import { CCM_ROLLUP, COACHING_HEALTH_SUMMARY, COACHING_TLS } from '../data/coachingHierarchy'

export default function CoachingHealthPanel({ onStatClick }) {
  const [expanded, setExpanded] = useState(false)
  const [view, setView] = useState('summary')
  const [selectedTlId, setSelectedTlId] = useState(null)

  const selectedTl = COACHING_TLS.find((tl) => tl.id === selectedTlId)

  return (
    <div className="coaching-health-panel">
      <div className="coaching-health coaching-health--compact">
        {COACHING_HEALTH_SUMMARY.map((stat, i) => (
          <HealthStatCard
            key={stat.label}
            {...stat}
            onClick={onStatClick ? () => onStatClick(`ccm-coaching-${i}`) : undefined}
          />
        ))}
      </div>

      <button
        type="button"
        className="coaching-health-expand-btn"
        onClick={() => {
          setExpanded((e) => !e)
          if (expanded) {
            setView('summary')
            setSelectedTlId(null)
          }
        }}
      >
        {expanded ? 'Collapse hierarchy ↑' : 'Expand coaching hierarchy by TL and CCM →'}
      </button>

      {expanded && (
        <div className="coaching-health-expanded">
          <div className="coaching-health-tabs">
            <button
              type="button"
              className={view === 'ccm' ? 'coaching-tab coaching-tab--active' : 'coaching-tab'}
              onClick={() => { setView('ccm'); setSelectedTlId(null) }}
            >
              CCM rollup · {CCM_ROLLUP.name}
            </button>
            <button
              type="button"
              className={view === 'tls' ? 'coaching-tab coaching-tab--active' : 'coaching-tab'}
              onClick={() => { setView('tls'); setSelectedTlId(null) }}
            >
              Team Leaders ({COACHING_TLS.length})
            </button>
          </div>

          {view === 'ccm' && (
            <table className="coaching-hierarchy-table">
              <thead>
                <tr>
                  <th>Team Leader</th>
                  <th>Team</th>
                  <th>Deployed</th>
                  <th>Taken up</th>
                  <th>In progress</th>
                  <th>Not touched</th>
                </tr>
              </thead>
              <tbody>
                {COACHING_TLS.map((tl) => (
                  <tr key={tl.id}>
                    <td>{tl.name}</td>
                    <td>{tl.team}</td>
                    <td>{tl.deployed}</td>
                    <td>{tl.takenUp}</td>
                    <td>{tl.inProgress}</td>
                    <td>{tl.notTouched}</td>
                  </tr>
                ))}
                <tr className="coaching-hierarchy-total">
                  <td colSpan={2}><strong>{CCM_ROLLUP.name} · Total</strong></td>
                  <td><strong>{CCM_ROLLUP.deployed}</strong></td>
                  <td><strong>{CCM_ROLLUP.takenUp}</strong></td>
                  <td><strong>{CCM_ROLLUP.inProgress}</strong></td>
                  <td><strong>{CCM_ROLLUP.notTouched}</strong></td>
                </tr>
              </tbody>
            </table>
          )}

          {view === 'tls' && !selectedTl && (
            <div className="coaching-tl-list">
              {COACHING_TLS.map((tl) => (
                <button
                  key={tl.id}
                  type="button"
                  className="coaching-tl-row"
                  onClick={() => setSelectedTlId(tl.id)}
                >
                  <div className="coaching-tl-row-main">
                    <strong>{tl.name}</strong>
                    <span className="coaching-tl-team">{tl.team}</span>
                  </div>
                  <div className="coaching-tl-row-stats">
                    <span>{tl.takenUp}/{tl.deployed} taken up</span>
                    <span className="coaching-tl-drill">View agents →</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {view === 'tls' && selectedTl && (
            <div className="coaching-agent-panel">
              <button type="button" className="coaching-back-btn" onClick={() => setSelectedTlId(null)}>
                ← Back to Team Leaders
              </button>
              <div className="coaching-agent-panel-header">
                <strong>{selectedTl.name}</strong>
                <span>{selectedTl.team} · {selectedTl.agents.length} agents</span>
              </div>
              <table className="coaching-hierarchy-table">
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th>Micro coaching</th>
                    <th>Formal coaching</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTl.agents.map((agent) => (
                    <tr key={agent.name}>
                      <td>{agent.name}</td>
                      <td>{agent.micro}</td>
                      <td>
                        <span className={`badge ${agent.formalClass}`}>{agent.formal}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

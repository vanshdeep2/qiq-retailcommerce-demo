import { useMemo } from 'react'
import { computeAgentCallStats } from '../utils/agentCallStats'

export default function AgentOverviewSnapshot({ row, agent, calls }) {
  const stats = useMemo(
    () => computeAgentCallStats(calls, agent.name),
    [calls, agent.name],
  )

  return (
    <div className="tl-overview-snapshot">
      <div className="agent-overview-summary">
        <div className="agent-overview-name">{row.name}</div>
        <div className="agent-overview-metrics">
          <span>
            QA W5 <strong>{row.qaW5.toFixed(1)}</strong>
          </span>
          <span>
            PA <strong>{row.pa}</strong>
          </span>
          <span>
            RR <strong>{row.rr}</strong>
          </span>
        </div>
        <div className="agent-overview-footer">
          <span className="agent-overview-topic">{row.topic}</span>
          <span className={`badge ${row.badgeClass}`}>{row.status}</span>
        </div>
      </div>

      <div className="tl-snapshot-section-title">Call snapshot</div>
      <div className="tl-snapshot-grid">
        <div className="tl-snapshot-stat">
          <div className="tl-snapshot-stat-val">{stats.totalCalls}</div>
          <div className="tl-snapshot-stat-lbl">Total calls</div>
        </div>
        <div className="tl-snapshot-stat">
          <div className="tl-snapshot-stat-val">
            {stats.avgQa != null ? stats.avgQa.toFixed(1) : '-'}
          </div>
          <div className="tl-snapshot-stat-lbl">Avg QA score</div>
        </div>
        <div className="tl-snapshot-stat">
          <div className="tl-snapshot-stat-val">{stats.fcrRate.toFixed(0)}%</div>
          <div className="tl-snapshot-stat-lbl">FCR rate</div>
        </div>
        <div className="tl-snapshot-stat">
          <div className={`tl-snapshot-stat-val ${stats.cfCount > 0 ? 'val-red' : 'val-green'}`}>
            {stats.cfCount}
          </div>
          <div className="tl-snapshot-stat-lbl">Critical failures</div>
        </div>
      </div>

      {stats.categories.length > 0 && (
        <>
          <div className="tl-snapshot-section-title">Call types handled</div>
          <div className="tl-category-table-wrap">
            <table className="tl-category-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Calls</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {stats.categories.map(({ category, count }) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>{count}</td>
                    <td>
                      {stats.totalCalls > 0
                        ? `${((count / stats.totalCalls) * 100).toFixed(0)}%`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="tl-snapshot-section-title">QiQ performance insight</div>
      <p className="tl-drawer-insight">{agent.insight}</p>
    </div>
  )
}

import { Link } from 'react-router-dom'
import SparkQaChart from './charts/SparkQaChart'
import { sparkDeltaText, sparkScoreClass } from '../utils/format'
import { COACHING_WEEK_INDEX, WK_LABELS } from '../data/agents'

export default function SparkAgentCard({ agent, variant = 'preview' }) {
  const scoreCls = sparkScoreClass(agent.series)
  const coachingLabel = WK_LABELS[COACHING_WEEK_INDEX]

  if (variant === 'drawer') {
    return (
      <Link to={`/agent/${agent.slug}`} className="drawer-agent-block" title={`Open ${agent.name}`}>
        <div className="drawer-agent-top">
          <span className="drawer-agent-name">{agent.name}</span>
          <span className={`drawer-agent-score ${scoreCls}`}>{agent.w5.toFixed(1)}</span>
        </div>
        <div className="drawer-agent-meta">{sparkDeltaText(agent.series)}</div>
        <div className="drawer-chart-wrap">
          <SparkQaChart labels={WK_LABELS} data={agent.series} coachingWeekLabel={coachingLabel} height={110} />
        </div>
        <div className="drawer-agent-link">Open agent view →</div>
      </Link>
    )
  }

  return (
    <Link to={`/agent/${agent.slug}`} className="spark-card" title={`Open ${agent.name}`}>
      <div className="spark-card-top">
        <span className="spark-card-name">{agent.name}</span>
        <span className={`spark-card-score ${scoreCls}`}>{agent.w5.toFixed(1)}</span>
      </div>
      <div className="spark-card-meta">{sparkDeltaText(agent.series)}</div>
      <div className="spark-chart-wrap">
        <SparkQaChart labels={WK_LABELS} data={agent.series} coachingWeekLabel={coachingLabel} height={110} />
      </div>
    </Link>
  )
}

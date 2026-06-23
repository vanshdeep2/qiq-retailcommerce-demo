import { useEffect, useMemo, useState } from 'react'
import { buildCoachingQueue } from '../utils/coachingQueue'
import { formatDate } from '../utils/format'
import '../styles/agent.css'

export default function CoachingQueueList({ coaching, idPrefix = 'queue', compact = false }) {
  const [queueOpen, setQueueOpen] = useState({})
  const coachingQueue = useMemo(() => buildCoachingQueue(coaching), [coaching])

  useEffect(() => {
    setQueueOpen({})
  }, [idPrefix, coaching])

  if (!coachingQueue.length) {
    return <p className="coaching-queue-empty">No coaching sessions for this agent yet.</p>
  }

  return (
    <div className={`coaching-queue ${compact ? 'coaching-queue-compact' : ''}`}>
      {coachingQueue.map((entry, i) => {
        const entryId = `${idPrefix}-${i}`
        const isOpen = queueOpen[entryId]
        return (
          <div key={entryId} className="queue-entry">
            <button
              type="button"
              className="queue-entry-header"
              aria-expanded={isOpen ? 'true' : 'false'}
              onClick={() =>
                setQueueOpen((prev) => ({ ...prev, [entryId]: !prev[entryId] }))
              }
            >
              <div className="queue-entry-meta">
                <span className="queue-entry-date">{formatDate(entry.date)}</span>
                <span className="queue-entry-topic">{entry.topic}</span>
              </div>
              <div className="queue-entry-right">
                <span className={`badge ${entry.badgeClass}`}>{entry.status}</span>
                <span className="queue-chevron" aria-hidden="true">
                  {isOpen ? '▾' : '▸'}
                </span>
              </div>
            </button>
            {isOpen && (
              <div className="queue-entry-body">
                {entry.type === 'strength' ? (
                  <span className="coach-badge coach-badge-green">Strength</span>
                ) : (
                  <span className="coach-badge coach-badge-amber">Development</span>
                )}
                <p className="coach-body">{entry.content}</p>
                {entry.evidence && (
                  <div className="evidence-body">
                    <p>{entry.evidence}</p>
                  </div>
                )}
                {entry.lms && (
                  <button
                    type="button"
                    className="lms-link"
                    onClick={() => alert(`LMS module (demo only):\n\n${entry.lms}`)}
                  >
                    LMS Module: {entry.lms}
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

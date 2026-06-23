import { formatDate } from '../utils/format'
import '../styles/agent.css'

export default function NotesThread({ notes, teamLeadName, compact = false }) {
  if (!notes?.length) {
    return <p className="notes-thread-empty">No coaching notes recorded yet.</p>
  }

  return (
    <div className={`thread-panel ${compact ? 'thread-panel-compact' : ''}`}>
      <div className="notes-list">
        {notes.map((note) => {
          const isTl = note.role === 'Team Lead'
          return (
            <article key={`${note.from}-${note.date}`} className="note-card">
              <div className="note-card-top">
                <span className="note-card-name">{note.from}</span>
                <span className={isTl ? 'note-badge-tl' : 'note-badge-agent'}>
                  {isTl ? 'Team Lead' : 'Agent'}
                </span>
                <span className="note-card-date">{formatDate(note.date)}</span>
              </div>
              <p className="note-card-body">{note.message}</p>
            </article>
          )
        })}
      </div>
      <p className="thread-footnote">
        Coaching notes are recorded by {teamLeadName || 'your team leader'} and shared here.
      </p>
    </div>
  )
}

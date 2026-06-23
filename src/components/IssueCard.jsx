import '../styles/components.css'

export default function IssueCard({
  severity,
  title,
  body,
  contacts,
  volumePct,
  tags = [],
  link,
}) {
  const severityClass = severity === 'high' ? 'issue-card-high' : 'issue-card-medium'

  return (
    <div className={`issue-card ${severityClass}`}>
      <div className="issue-card-top">
        <div className="issue-card-title">{title}</div>
      </div>
      <p className="issue-card-body">{body}</p>
      {(contacts || volumePct != null) && (
        <div className="issue-card-meta">
          {contacts && <span>{contacts} contacts</span>}
          {contacts && volumePct != null && ' · '}
          {volumePct != null && <span>{volumePct}% of volume</span>}
        </div>
      )}
      {tags.length > 0 && (
        <div className="issue-card-tags">
          {tags.map((tag) => (
            <span key={tag} className="tag tag-muted">
              {tag}
            </span>
          ))}
        </div>
      )}
      {link && (
        <a className="issue-card-link" href={link}>
          See trend →
        </a>
      )}
    </div>
  )
}

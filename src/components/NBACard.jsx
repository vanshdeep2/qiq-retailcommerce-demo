import '../styles/components.css'

export default function NBACard({ number, title, detail, level, kpis = [], impact, link }) {
  return (
    <div className="action-nba">
      <div className="action-nba-num">{number}</div>
      <div className="action-nba-body">
        <div className="action-nba-title">{title}</div>
        {detail && <div className="action-nba-detail">{detail}</div>}
        {level && <div className="action-nba-detail">{level}</div>}
        {kpis.length > 0 && (
          <div className="action-nba-tags">
            {kpis.map((kpi) => (
              <span key={kpi} className="tag tag-muted">
                {kpi}
              </span>
            ))}
          </div>
        )}
        {link && (
          <a className="action-nba-link" href={link}>
            See coaching →
          </a>
        )}
      </div>
      {impact && <div className="action-nba-impact">{impact}</div>}
    </div>
  )
}

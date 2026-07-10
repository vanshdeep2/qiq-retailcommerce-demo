export default function HealthStatCard({ label, value, valueClass = '', sub, onClick }) {
  const Wrapper = onClick ? 'button' : 'div'
  const wrapperProps = onClick ? { type: 'button', onClick } : {}

  return (
    <Wrapper className={`health-stat-card${onClick ? ' health-stat-card--clickable' : ''}`} {...wrapperProps}>
      <div className="health-stat-lbl">{label}</div>
      <div className={`health-stat-val ${valueClass}`.trim()}>{value}</div>
      <div className="health-stat-sub">{sub}</div>
      {onClick && <div className="health-stat-drill">Details →</div>}
    </Wrapper>
  )
}

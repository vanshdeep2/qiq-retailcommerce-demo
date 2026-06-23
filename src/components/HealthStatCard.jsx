export default function HealthStatCard({ label, value, valueClass = '', sub }) {
  return (
    <div className="health-stat-card">
      <div className="health-stat-lbl">{label}</div>
      <div className={`health-stat-val ${valueClass}`.trim()}>{value}</div>
      <div className="health-stat-sub">{sub}</div>
    </div>
  )
}

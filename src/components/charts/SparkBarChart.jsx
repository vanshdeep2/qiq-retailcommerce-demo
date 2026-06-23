import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import CoachingPeriodBand from './CoachingPeriodBand'
import CoachingWeekMarker from './CoachingWeekMarker'
import '../../styles/components.css'

const TICK_STYLE = { fontSize: 9, fill: '#9b9b9b', fontFamily: 'DM Sans, sans-serif' }

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-val">{payload[0].value}</span>
    </div>
  )
}

export default function SparkBarChart({
  labels,
  data,
  barColors,
  coachingWeekLabel,
  coachingPeriodBand,
  coachingPeriodStart,
  coachingPeriodEnd,
  height = 140,
}) {
  const chartData = labels.map((label, i) => ({ label, value: data[i], color: barColors[i] }))
  const hasBand = coachingPeriodBand && coachingPeriodStart && coachingPeriodEnd
  const topMargin = hasBand || coachingWeekLabel ? 26 : 8

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: topMargin, right: 8, left: 4, bottom: 0 }}>
        <CartesianGrid stroke="#f0f0ee" vertical horizontal />
        <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} tickLine={false} interval={0} />
        <YAxis
          width={32}
          tick={TICK_STYLE}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
        {hasBand && (
          <CoachingPeriodBand startLabel={coachingPeriodStart} endLabel={coachingPeriodEnd} />
        )}
        {!hasBand && coachingWeekLabel && (
          <CoachingWeekMarker weekLabel={coachingWeekLabel} variant="ccm" />
        )}
        <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
          {chartData.map((entry) => (
            <Cell key={entry.label} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

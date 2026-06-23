import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { sparkLineColor } from '../../utils/format'
import CoachingWeekMarker from './CoachingWeekMarker'
import '../../styles/components.css'

const TICK_STYLE = { fontSize: 9, fill: '#9b9b9b', fontFamily: 'DM Sans, sans-serif' }

function QaTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const week = String(label || '').replace('W', '')
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-lbl">Week {week}</span>
      <span className="chart-tooltip-val">QA score: {payload[0].value.toFixed(1)}</span>
    </div>
  )
}

export default function SparkQaChart({ labels, data, coachingWeekLabel, height = 110 }) {
  const color = sparkLineColor(data)
  const gradientId = `qa-fill-${color.replace('#', '')}`
  const chartData = labels.map((label, i) => ({
    label,
    value: data[i],
    pointRadius: i === data.length - 1 ? 4 : 2.5,
    pointFill: i === data.length - 1 ? color : '#fff',
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 6, right: 2, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.125} />
            <stop offset="100%" stopColor={color} stopOpacity={0.125} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f0f0ee" vertical={false} horizontal />
        <XAxis
          dataKey="label"
          tick={TICK_STYLE}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis
          domain={[0, 100]}
          ticks={[0, 50, 100]}
          tick={TICK_STYLE}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip content={<QaTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }} />
        {coachingWeekLabel && <CoachingWeekMarker weekLabel={coachingWeekLabel} variant="qa" />}
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={(props) => {
            const { cx, cy, index } = props
            const entry = chartData[index]
            return (
              <circle
                key={index}
                cx={cx}
                cy={cy}
                r={entry.pointRadius}
                fill={entry.pointFill}
                stroke={color}
                strokeWidth={2}
              />
            )
          }}
          activeDot={{ r: 5, fill: color, stroke: '#fff', strokeWidth: 2 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import CoachingPeriodBand from './CoachingPeriodBand'
import CoachingWeekMarker from './CoachingWeekMarker'
import '../../styles/components.css'

const TICK_STYLE = { fontSize: 9, fill: '#9b9b9b', fontFamily: 'DM Sans, sans-serif' }

function ChartTooltip({ active, payload, formatValue, secondaryFormatValue }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      {payload.map((entry) => {
        const formatter = entry.dataKey === 'secondary' ? secondaryFormatValue : formatValue
        const raw = entry.value
        const text = formatter ? formatter(raw) : raw
        return (
          <div key={entry.dataKey} className="chart-tooltip-row">
            <span className="chart-tooltip-val">{text}</span>
          </div>
        )
      })}
    </div>
  )
}

function ChartLegend({ payload }) {
  if (!payload?.length) return null
  return (
    <div className="chart-legend">
      {payload.map((entry) => (
        <span key={entry.value} className="chart-legend-item">
          <span
            className="chart-legend-swatch"
            style={{
              background: entry.color,
              borderStyle: entry.payload?.strokeDasharray ? 'dashed' : 'solid',
            }}
          />
          {entry.value}
        </span>
      ))}
    </div>
  )
}

export default function SparklineChart({
  labels,
  data,
  color,
  height = 80,
  formatValue,
  coachingWeekLabel,
  coachingPeriodBand,
  coachingPeriodStart,
  coachingPeriodEnd,
  yDomain,
  secondaryData,
  secondaryName = 'Coaching deployment',
  secondaryFormatValue,
  primaryName,
}) {
  const chartData = labels.map((label, i) => ({
    label,
    value: data[i],
    secondary: secondaryData?.[i],
  }))
  const gradientId = `fill-${color.replace('#', '')}`
  const hasBand = coachingPeriodBand && coachingPeriodStart && coachingPeriodEnd
  const hasSecondary = secondaryData?.length > 0
  const topMargin = hasBand || coachingWeekLabel ? 26 : 4
  const bottomMargin = hasSecondary ? 18 : 0

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={chartData}
        margin={{ top: topMargin, right: hasSecondary ? 28 : 8, left: 4, bottom: bottomMargin }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.094} />
            <stop offset="100%" stopColor={color} stopOpacity={0.094} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f0f0ee" vertical horizontal />
        <XAxis
          dataKey="label"
          tick={TICK_STYLE}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis
          yAxisId="left"
          width={32}
          tick={TICK_STYLE}
          axisLine={false}
          tickLine={false}
          tickCount={4}
          domain={yDomain || ['auto', 'auto']}
        />
        {hasSecondary && (
          <YAxis
            yAxisId="right"
            orientation="right"
            width={28}
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            tickCount={4}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
        )}
        {hasBand && (
          <CoachingPeriodBand startLabel={coachingPeriodStart} endLabel={coachingPeriodEnd} />
        )}
        {!hasBand && coachingWeekLabel && (
          <CoachingWeekMarker weekLabel={coachingWeekLabel} variant="ccm" />
        )}
        <Tooltip
          content={
            <ChartTooltip
              formatValue={formatValue}
              secondaryFormatValue={secondaryFormatValue || ((v) => `${v}%`)}
            />
          }
          cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }}
        />
        {hasSecondary && (
          <Legend
            verticalAlign="bottom"
            height={16}
            content={<ChartLegend />}
            payload={[
              { value: primaryName || 'KPI', type: 'line', color },
              {
                value: secondaryName,
                type: 'line',
                color: '#9b9b9b',
                payload: { strokeDasharray: '4 4' },
              },
            ]}
          />
        )}
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="value"
          name={primaryName || 'KPI'}
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={{ r: 2.5, fill: color, strokeWidth: 0 }}
          activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 1 }}
          isAnimationActive={false}
        />
        {hasSecondary && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="secondary"
            name={secondaryName}
            stroke="#9b9b9b"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={{ r: 2, fill: '#9b9b9b', strokeWidth: 0 }}
            isAnimationActive={false}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

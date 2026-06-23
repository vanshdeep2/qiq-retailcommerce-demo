import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

export default function FinancialDonut({ data, colors, size = 120, cutout = '72%', animate = false }) {
  const chartData = data.map((value, i) => ({ value, color: colors[i] }))

  return (
    <ResponsiveContainer width={size} height={size}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={cutout}
          outerRadius="100%"
          paddingAngle={0}
          dataKey="value"
          stroke="none"
          cornerRadius={3}
          isAnimationActive={animate}
        >
          {chartData.map((entry) => (
            <Cell key={entry.color} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

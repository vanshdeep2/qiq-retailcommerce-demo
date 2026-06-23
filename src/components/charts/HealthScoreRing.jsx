import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

export default function HealthScoreRing({ score, color }) {
  const data = [
    { value: score },
    { value: 100 - score },
  ]

  return (
    <ResponsiveContainer width={130} height={130}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          startAngle={210}
          endAngle={-30}
          innerRadius="80%"
          outerRadius="100%"
          paddingAngle={0}
          dataKey="value"
          stroke="none"
          cornerRadius={4}
          isAnimationActive={false}
        >
          <Cell fill={color} />
          <Cell fill="rgba(255,255,255,0.1)" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

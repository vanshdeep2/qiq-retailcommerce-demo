export default function CoachingPeriodLabel({ viewBox }) {
  if (!viewBox) return null
  const { x, y } = viewBox
  return (
    <text
      x={x + 4}
      y={y + 12}
      fill="#9b9b9b"
      fontSize={9}
      fontFamily="DM Sans, sans-serif"
      fontWeight={600}
    >
      Coaching period
    </text>
  )
}

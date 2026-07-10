const PAD_X = 6
const BOX_H = 16

export default function CoachingWeekBoxLabel({ viewBox, parentViewBox, weekLabel = 'W5' }) {
  if (!viewBox) return null

  const label = `Coaching deployed ${weekLabel}.`
  const textWidth = Math.max(118, label.length * 6.2)
  const boxW = textWidth + PAD_X * 2

  const { x, y, width } = viewBox
  const lineX = x + (width || 0) / 2
  const top = y ?? 0
  const boxY = top + 4
  let boxX = lineX - boxW / 2
  if (parentViewBox?.width > 0) {
    const chartLeft = parentViewBox.x
    const chartRight = parentViewBox.x + parentViewBox.width
    boxX = Math.min(Math.max(boxX, chartLeft), Math.max(chartRight - boxW, chartLeft))
  }
  const textX = boxX + boxW / 2
  const textY = boxY + BOX_H / 2

  return (
    <g>
      <rect
        x={boxX}
        y={boxY}
        width={boxW}
        height={BOX_H}
        rx={3}
        ry={3}
        fill="rgba(255,255,255,0.95)"
        stroke="rgba(217,119,6,0.35)"
        strokeWidth={1}
      />
      <text
        x={textX}
        y={textY}
        fill="#d97706"
        fontSize={10}
        fontWeight={600}
        fontFamily="DM Sans, sans-serif"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {label}
      </text>
    </g>
  )
}

const LABEL = 'Coaching deployed W3.'
const PAD_X = 6
const BOX_H = 16
// Measured equivalent for 600 10px DM Sans
const TEXT_WIDTH = 118
const BOX_W = TEXT_WIDTH + PAD_X * 2

export default function CoachingWeekBoxLabel({ viewBox, parentViewBox }) {
  if (!viewBox) return null

  const { x, y, width } = viewBox
  // Vertical ReferenceLine rects have width 0; x is the line pixel position.
  const lineX = x + (width || 0) / 2
  const top = y ?? 0
  const boxY = top + 4
  let boxX = lineX - BOX_W / 2
  if (parentViewBox?.width > 0) {
    const chartLeft = parentViewBox.x
    const chartRight = parentViewBox.x + parentViewBox.width
    boxX = Math.min(Math.max(boxX, chartLeft), Math.max(chartRight - BOX_W, chartLeft))
  }
  const textX = boxX + BOX_W / 2
  const textY = boxY + BOX_H / 2

  return (
    <g>
      <rect
        x={boxX}
        y={boxY}
        width={BOX_W}
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
        {LABEL}
      </text>
    </g>
  )
}

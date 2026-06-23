import { ReferenceArea } from 'recharts'
import CoachingPeriodLabel from './CoachingPeriodLabel'

export default function CoachingPeriodBand({ startLabel, endLabel }) {
  if (!startLabel || !endLabel) return null

  return (
    <ReferenceArea
      x1={startLabel}
      x2={endLabel}
      fill="rgba(217, 119, 6, 0.08)"
      strokeOpacity={0}
      label={{ content: CoachingPeriodLabel, position: 'insideTopLeft' }}
    />
  )
}

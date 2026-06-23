import { ReferenceLine } from 'recharts'
import CoachingWeekBoxLabel from './CoachingWeekBoxLabel'

export default function CoachingWeekMarker({ weekLabel, variant = 'ccm' }) {
  if (!weekLabel) return null

  const isQa = variant === 'qa'
  return (
    <ReferenceLine
      x={weekLabel}
      stroke={isQa ? 'rgba(217, 119, 6, 0.45)' : '#d97706'}
      strokeWidth={isQa ? 1.5 : 2}
      strokeDasharray={isQa ? '4 3' : '6 4'}
      label={
        variant === 'ccm'
          ? { content: CoachingWeekBoxLabel, position: 'insideTop', offset: 4 }
          : undefined
      }

    />
  )
}

const QUEUE_META = [
  { date: '2026-05-08', status: 'Completed', badgeClass: 'badge-green' },
  { date: '2026-05-15', status: 'In Progress', badgeClass: 'badge-amber' },
  { date: '2026-05-23', status: 'New', badgeClass: 'badge-navy' },
]

export function buildCoachingQueue(coaching) {
  if (!coaching?.length) return []

  const [first, second] = coaching
  const entry2Card = second ?? {
    ...first,
    topic: `Follow-up: ${first.topic}`,
  }
  const entry3Card = {
    ...first,
    topic: `Follow-up: ${first.topic}`,
  }

  const cards = [first, entry2Card, entry3Card]

  return QUEUE_META.map((meta, i) => ({
    ...meta,
    ...cards[i],
  }))
}

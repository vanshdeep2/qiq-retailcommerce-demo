export function buildCoachingQueue(coaching, microLog) {
  if (microLog?.length) {
    return microLog.map((entry) => ({
      date: entry.date,
      topic: entry.topic,
      status: entry.status,
      badgeClass: entry.badgeClass,
      type: entry.type || 'development',
      content: entry.content || entry.nudge,
      evidence: entry.evidence,
      lms: entry.lms ?? null,
    }))
  }

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

  const cards = [first, second, entry2Card, entry3Card].filter(Boolean).slice(0, 3)
  const queueMeta = [
    { date: '2026-05-08', status: 'Completed', badgeClass: 'badge-green' },
    { date: '2026-05-15', status: 'In Progress', badgeClass: 'badge-amber' },
    { date: '2026-05-23', status: 'New', badgeClass: 'badge-navy' },
  ]

  return queueMeta.map((meta, i) => ({
    ...meta,
    ...cards[i],
  }))
}

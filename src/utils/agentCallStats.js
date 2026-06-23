export function computeAgentCallStats(calls, agentName) {
  const agentCalls = calls.filter((c) => c.agent_name === agentName)

  const scoredCalls = agentCalls.filter((c) => c.qa_score != null && c.qa_pass !== false)
  const avgQa =
    scoredCalls.length > 0
      ? scoredCalls.reduce((sum, c) => sum + c.qa_score, 0) / scoredCalls.length
      : null

  const fcrResolved = agentCalls.filter((c) => c.fcr_resolved === true).length
  const fcrRate = agentCalls.length > 0 ? (fcrResolved / agentCalls.length) * 100 : 0

  const cfCount = agentCalls.filter((c) => c.critical_failure === true).length

  const categoryMap = new Map()
  agentCalls.forEach((c) => {
    categoryMap.set(c.call_category, (categoryMap.get(c.call_category) || 0) + 1)
  })
  const categories = [...categoryMap.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)

  return {
    totalCalls: agentCalls.length,
    avgQa,
    fcrRate,
    cfCount,
    categories,
  }
}

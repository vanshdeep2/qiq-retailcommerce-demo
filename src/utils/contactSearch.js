import { WEEK_BOUNDARIES } from '../data/contactSearchConstants'

export function getQaScoreCellClass(score, qaPass) {
  if (qaPass === false) return 'qa-pill-autofail'
  if (score == null) return 'qa-pill-muted'
  if (score > 90) return 'qa-pill-green'
  if (score >= 70) return 'qa-pill-amber'
  return 'qa-pill-red'
}

export function formatQaScoreDisplay(score, qaPass) {
  if (qaPass === false) return 'AUTO-FAIL'
  if (score == null) return 'Pending QA'
  return score.toFixed(1)
}

function qaSortValue(score, sortDir) {
  if (score == null) return sortDir === 'asc' ? Infinity : -Infinity
  return score
}

export function getSectionBarClass(pct) {
  if (pct > 80) return 'section-bar-green'
  if (pct >= 60) return 'section-bar-amber'
  return 'section-bar-red'
}

export function getWeekIndex(callDate) {
  const idx = WEEK_BOUNDARIES.findIndex((w) => callDate >= w.start && callDate <= w.end)
  return idx >= 0 ? idx : 7
}

export function parseTranscript(text) {
  if (!text) return []
  return text.split('\n').filter(Boolean).map((line) => {
    const agentMatch = line.match(/^Agent(?:\s*\([^)]*\))?:\s*(.*)$/i)
    if (agentMatch) return { role: 'agent', text: agentMatch[1] || line }

    const merchantMatch = line.match(/^(?:Merchant|Customer)(?:\s*\([^)]*\))?:\s*(.*)$/i)
    if (merchantMatch) return { role: 'customer', text: merchantMatch[1] || line }

    return { role: 'other', text: line }
  })
}

export function getMetBadge(evalItem) {
  if (evalItem.applicable === false) return { label: 'N/A', className: 'q-badge-na' }
  if (evalItem.llm_score_awarded === 1) return { label: 'Met', className: 'q-badge-met' }
  return { label: 'Not Met', className: 'q-badge-not-met' }
}

export function passesScoreFilter(call, scoreFilter) {
  if (scoreFilter === 'all') return true
  if (scoreFilter === 'autofail') return call.qa_pass === false
  if (scoreFilter === 'below70') return call.qa_score != null && call.qa_score < 70
  if (scoreFilter === '70to90') return call.qa_score >= 70 && call.qa_score <= 90
  if (scoreFilter === 'above90') return call.qa_score > 90
  return true
}

export function sortCalls(calls, sortField, sortDir) {
  const dir = sortDir === 'asc' ? 1 : -1
  return [...calls].sort((a, b) => {
    if (sortField === 'qa_score') {
      const av = qaSortValue(a.qa_score, sortDir)
      const bv = qaSortValue(b.qa_score, sortDir)
      return av > bv ? dir : av < bv ? -dir : 0
    }
    if (sortField === 'call_date') {
      return a.call_date > b.call_date ? dir : a.call_date < b.call_date ? -dir : 0
    }
    if (sortField === 'agent_name') {
      return a.agent_name > b.agent_name ? dir : a.agent_name < b.agent_name ? -dir : 0
    }
    if (sortField === 'call_id') {
      return a.call_id > b.call_id ? dir : a.call_id < b.call_id ? -dir : 0
    }
    if (sortField === 'call_category') {
      return a.call_category > b.call_category ? dir : a.call_category < b.call_category ? -dir : 0
    }
    return 0
  })
}

export function filterCalls(calls, filters) {
  return calls
    .filter((c) => filters.agent === 'all' || c.agent_name === filters.agent)
    .filter((c) => filters.category === 'all' || c.call_category === filters.category)
    .filter((c) => c.call_date >= filters.dateFrom && c.call_date <= filters.dateTo)
    .filter((c) => passesScoreFilter(c, filters.scoreFilter))
    .filter((c) => !filters.criticalOnly || c.critical_failure === true)
    .filter((c) => {
      if (filters.resolution === 'resolved') return c.fcr_resolved === true
      if (filters.resolution === 'unresolved') return c.fcr_resolved === false
      return true
    })
    .filter((c) => {
      const q = (filters.textSearch || '').trim().toLowerCase()
      if (!q) return true
      const haystack = [
        c.call_id,
        c.agent_name,
        c.merchant_name,
        c.merchant_contact,
        c.order_number,
        c.call_category,
        c.call_subcategory,
        c.transcript,
        c.narrative_summary,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
}

export function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

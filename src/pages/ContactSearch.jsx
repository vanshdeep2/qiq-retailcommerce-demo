import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Nav from '../components/Nav'
import CallDetailModal from '../components/CallDetailModal'
import { CALLS_PILL, LIVE_LABEL } from '../data/executiveConstants'
import { CF_QUICK_LINKS, DEFAULT_FILTERS, WEEK_BOUNDARIES } from '../data/contactSearchConstants'
import {
  filterCalls,
  formatQaScoreDisplay,
  getQaScoreCellClass,
  sortCalls,
  uniqueSorted,
} from '../utils/contactSearch'
import { formatDate } from '../utils/format'
import '../styles/search.css'

const COLUMNS = [
  { key: 'call_id', label: 'Call ID', sortField: 'call_id' },
  { key: 'agent_name', label: 'Agent', sortField: 'agent_name' },
  { key: 'call_date', label: 'Date', sortField: 'call_date' },
  { key: 'call_category', label: 'Category', sortField: 'call_category' },
  { key: 'qa_score', label: 'QA Score', sortField: 'qa_score' },
  { key: 'csat', label: 'CSAT', sortField: null },
  { key: 'fcr', label: 'FCR', sortField: null },
  { key: 'cf', label: 'Critical Failure', sortField: null },
  { key: 'actions', label: 'Actions', sortField: null },
]

export default function ContactSearch() {
  const [searchParams] = useSearchParams()
  const prefilledCall = searchParams.get('call')
  const prefilledCritical = searchParams.get('criticalOnly') === 'true'
  const prefilledAgent = searchParams.get('agent')

  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sortField, setSortField] = useState('qa_score')
  const [sortDir, setSortDir] = useState('asc')
  const [expandedCall, setExpandedCall] = useState(null)
  const [activeTab, setActiveTab] = useState('summary')
  const [visibleCount, setVisibleCount] = useState(50)

  useEffect(() => {
    fetch('/data/contact_search_data.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load contact data')
        return r.json()
      })
      .then((data) => {
        setCalls(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const callIdIndex = useMemo(() => {
    const map = new Map()
    calls.forEach((c) => map.set(c.call_id, c))
    return map
  }, [calls])

  const agentOptions = useMemo(
    () => uniqueSorted(calls.map((c) => c.agent_name)),
    [calls],
  )

  const categoryOptions = useMemo(
    () => uniqueSorted(calls.map((c) => c.call_category)),
    [calls],
  )

  const filteredCalls = useMemo(() => {
    const filtered = filterCalls(calls, filters)
    return sortCalls(filtered, sortField, sortDir)
  }, [calls, filters, sortField, sortDir])

  const visibleCalls = useMemo(
    () => filteredCalls.slice(0, visibleCount),
    [filteredCalls, visibleCount],
  )

  const openCall = useCallback((callId) => {
    setExpandedCall(callId)
    setActiveTab('summary')
  }, [])

  const selectedCall = expandedCall ? callIdIndex.get(expandedCall) : null

  const pendingQaCount = useMemo(
    () => filteredCalls.filter((c) => c.qa_score == null).length,
    [filteredCalls],
  )

  const prefilledHandled = useRef(false)
  const criticalHandled = useRef(false)
  const agentHandled = useRef(false)

  useEffect(() => {
    if (loading || !prefilledCritical || criticalHandled.current) return
    criticalHandled.current = true
    setFilters((f) => ({ ...f, criticalOnly: true }))
  }, [loading, prefilledCritical])

  useEffect(() => {
    if (loading || !prefilledAgent || agentHandled.current) return
    agentHandled.current = true
    setFilters((f) => ({ ...f, agent: prefilledAgent }))
  }, [loading, prefilledAgent])

  useEffect(() => {
    if (loading || !prefilledCall || prefilledHandled.current) return
    if (!callIdIndex.has(prefilledCall)) return
    prefilledHandled.current = true
    setExpandedCall(prefilledCall)
    setActiveTab('summary')
    const idx = filteredCalls.findIndex((c) => c.call_id === prefilledCall)
    if (idx >= 0 && idx >= visibleCount) {
      setVisibleCount(Math.ceil((idx + 1) / 50) * 50)
    }
  }, [loading, prefilledCall, callIdIndex, filteredCalls, visibleCount])

  const handleSort = (field) => {
    if (!field) return
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }))
    setVisibleCount(50)
  }

  const handleCfQuickLink = (callId) => {
    if (!callIdIndex.has(callId)) return
    setFilters(DEFAULT_FILTERS)
    setExpandedCall(callId)
    setActiveTab('summary')
    setVisibleCount(50)
  }

  const handleViewAllCritical = () => {
    setFilters({ ...DEFAULT_FILTERS, criticalOnly: true })
    setExpandedCall(null)
    setVisibleCount(50)
  }

  const updateFilter = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    handleFilterChange(key, val)
  }

  const handleWeekChange = (e) => {
    const week = e.target.value
    if (week === 'all') {
      setFilters((f) => ({
        ...f,
        week: 'all',
        dateFrom: DEFAULT_FILTERS.dateFrom,
        dateTo: DEFAULT_FILTERS.dateTo,
      }))
    } else {
      const bounds = WEEK_BOUNDARIES[Number(week)]
      setFilters((f) => ({
        ...f,
        week,
        dateFrom: bounds.start,
        dateTo: bounds.end,
      }))
    }
    setVisibleCount(50)
  }

  return (
    <>
      <Nav currentPage="search" liveLabel={LIVE_LABEL} callsPill={CALLS_PILL} />
      <div className="page">
        <div className="briefing-kicker">QiQ Contact Intelligence</div>
        <h1 className="briefing-title">Contact Search</h1>
        <div className="briefing-subtitle">
          QA analysts &amp; team leaders · 2,200 customer contacts · Search by order, customer, or contact reason
        </div>

        <div className="connector">Search &amp; Filter</div>

        <div className="search-filters">
          <div className="search-field search-field-wide">
            <label htmlFor="filter-text">Search</label>
            <input
              id="filter-text"
              type="search"
              placeholder="Order number, customer name, refund, return…"
              value={filters.textSearch}
              onChange={updateFilter('textSearch')}
            />
          </div>
          <div className="search-field">
            <label htmlFor="filter-agent">Agent</label>
            <select id="filter-agent" value={filters.agent} onChange={updateFilter('agent')}>
              <option value="all">All agents</option>
              {agentOptions.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="search-field">
            <label htmlFor="filter-category">Queue</label>
            <select id="filter-category" value={filters.category} onChange={updateFilter('category')}>
              <option value="all">All queues</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="search-field">
            <label htmlFor="filter-week">Week</label>
            <select id="filter-week" value={filters.week} onChange={handleWeekChange}>
              <option value="all">All weeks</option>
              {WEEK_BOUNDARIES.map((w, i) => (
                <option key={w.label} value={i}>{w.label}</option>
              ))}
            </select>
          </div>
          <div className="search-field">
            <label htmlFor="filter-resolution">Resolution</label>
            <select id="filter-resolution" value={filters.resolution} onChange={updateFilter('resolution')}>
              <option value="all">All</option>
              <option value="resolved">Resolved</option>
              <option value="unresolved">Unresolved</option>
            </select>
          </div>
          <div className="search-field">
            <label htmlFor="filter-date-from">Date from</label>
            <input id="filter-date-from" type="date" value={filters.dateFrom} onChange={updateFilter('dateFrom')} />
          </div>
          <div className="search-field">
            <label htmlFor="filter-date-to">Date to</label>
            <input id="filter-date-to" type="date" value={filters.dateTo} onChange={updateFilter('dateTo')} />
          </div>
          <div className="search-field">
            <label htmlFor="filter-score">QA score</label>
            <select id="filter-score" value={filters.scoreFilter} onChange={updateFilter('scoreFilter')}>
              <option value="all">All scores</option>
              <option value="autofail">Auto-fail only</option>
              <option value="below70">Below 70</option>
              <option value="70to90">70 - 90</option>
              <option value="above90">Above 90</option>
            </select>
          </div>
          <div className="search-field search-field-check">
            <label>
              <input
                type="checkbox"
                checked={filters.criticalOnly}
                onChange={updateFilter('criticalOnly')}
              />
              Critical failures only
            </label>
          </div>
        </div>

        <div className="search-quick">
          <span className="search-quick-label">Featured critical failures:</span>
          {CF_QUICK_LINKS.map((cf) => (
            <button
              key={cf.callId}
              type="button"
              className="search-quick-btn"
              onClick={() => handleCfQuickLink(cf.callId)}
            >
              {cf.label}
            </button>
          ))}
          <button
            type="button"
            className="search-quick-btn search-quick-btn-primary"
            onClick={handleViewAllCritical}
          >
            View all critical failures
          </button>
        </div>

        <div className="connector">Results</div>

        {loading && (
          <div className="search-loading">
            <div className="search-spinner" />
            Loading 2,200 contacts…
          </div>
        )}

        {error && (
          <div className="search-error">
            {error}. Ensure contact_search_data.json is in /public/data/.
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="search-results-meta">
              Showing {visibleCalls.length} of {filteredCalls.length} contacts
              {pendingQaCount > 0 && ` (${pendingQaCount} pending QA)`}.
            </div>

            <div className="ledger-panel search-table-wrap">
              <div className="ledger-table-wrap">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      {COLUMNS.map((col) => (
                        <th
                          key={col.key}
                          className={col.sortField ? `sortable ${sortField === col.sortField ? 'sort-active' : ''}` : ''}
                          onClick={() => handleSort(col.sortField)}
                        >
                          {col.label}
                          {col.sortField && sortField === col.sortField && (
                            <span className="sort-indicator">{sortDir === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleCalls.map((call) => (
                      <tr
                        key={call.call_id}
                        className="search-row"
                        onClick={() => openCall(call.call_id)}
                      >
                        <td>{call.call_id}</td>
                        <td>{call.agent_name}</td>
                        <td>{formatDate(call.call_date)}</td>
                        <td>{call.call_category}</td>
                        <td>
                          <span className={`qa-pill ${getQaScoreCellClass(call.qa_score, call.qa_pass)}`}>
                            {formatQaScoreDisplay(call.qa_score, call.qa_pass)}
                          </span>
                        </td>
                        <td>
                          {call.predicted_csat_score != null
                            ? `${Number(call.predicted_csat_score).toFixed(1)} · ${call.predicted_csat_label || ''}`
                            : '-'}
                        </td>
                        <td>{call.fcr_resolved ? 'Yes' : 'No'}</td>
                        <td>
                          {call.critical_failure ? (
                            <span className="cf-badge">
                              CF · {call.critical_failure_category || 'Critical'}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="search-action-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              openCall(call.call_id)
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {visibleCalls.length < filteredCalls.length && (
              <div className="search-load-more">
                <button
                  type="button"
                  className="search-load-more-btn"
                  onClick={() => setVisibleCount((v) => v + 50)}
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedCall && (
        <CallDetailModal
          call={selectedCall}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setExpandedCall(null)}
        />
      )}
    </>
  )
}

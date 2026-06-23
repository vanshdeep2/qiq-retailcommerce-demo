import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AgentCallsTable from './AgentCallsTable'
import AgentOverviewSnapshot from './AgentOverviewSnapshot'
import CoachingQueueList from './CoachingQueueList'
import NotesThread from './NotesThread'
import { AGENTS } from '../data/agents'
import { MATRIX_ROWS } from '../data/teamleadConstants'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'calls', label: 'Calls' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'notes', label: 'Notes' },
]

export default function AgentTlModal({ open, onClose, slug, calls }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const row = slug ? MATRIX_ROWS.find((r) => r.slug === slug) : null
  const agent = slug ? AGENTS[slug] : null

  useEffect(() => {
    if (open && slug) setActiveTab('overview')
  }, [open, slug])

  useEffect(() => {
    if (!open) return undefined

    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open || !slug || !row || !agent) return null

  return (
    <div
      className="agent-tl-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="agent-tl-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="agent-tl-modal-title"
      >
        <div className="agent-tl-modal-header">
          <div>
            <div id="agent-tl-modal-title" className="agent-tl-modal-title">{row.name}</div>
            <div className="agent-tl-modal-subtitle">
              Team leader view · overview, calls, coaching, and notes
            </div>
          </div>
          <button
            type="button"
            className="agent-tl-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="tl-drawer-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tl-drawer-tab ${activeTab === tab.id ? 'tl-drawer-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tl-drawer-content">
          {activeTab === 'overview' && (
            <AgentOverviewSnapshot row={row} agent={agent} calls={calls} />
          )}

          {activeTab === 'calls' && (
            <AgentCallsTable
              calls={calls}
              agentName={agent.name}
              limit={null}
              onReviewClick={(callId) => {
                onClose()
                navigate(`/search?call=${callId}`)
              }}
            />
          )}

          {activeTab === 'coaching' && (
            <CoachingQueueList
              coaching={agent.coaching}
              idPrefix={`modal-${row.slug}`}
              compact
            />
          )}

          {activeTab === 'notes' && (
            <NotesThread notes={agent.notes} teamLeadName={agent.team} compact />
          )}
        </div>
      </div>
    </div>
  )
}

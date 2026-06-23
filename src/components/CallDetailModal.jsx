import { useEffect } from 'react'
import CallDetailPanel from './CallDetailPanel'

export default function CallDetailModal({ call, activeTab, setActiveTab, onClose }) {
  useEffect(() => {
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
  }, [onClose])

  return (
    <div
      className="call-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="call-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="call-modal-title"
      >
        <div className="call-modal-header">
          <div>
            <div id="call-modal-title" className="call-modal-title">{call.call_id}</div>
            <div className="call-modal-subtitle">
              {call.agent_name} · {call.call_date} · {call.call_category}
            </div>
          </div>
          <button
            type="button"
            className="call-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <CallDetailPanel
          call={call}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hideHeader
        />
      </div>
    </div>
  )
}

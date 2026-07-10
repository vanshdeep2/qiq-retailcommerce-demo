import { useEffect } from 'react'
import '../styles/operations.css'

const SIZE_CLASS = {
  sm: 'modal-panel--sm',
  md: 'modal-panel--md',
  lg: 'modal-panel--lg',
}

export default function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  children,
  panelClassName = '',
  size = 'sm',
}) {
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

  if (!open) return null

  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.sm

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className={`modal-panel ${sizeClass} ${panelClassName}`.trim()}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-shell-title"
      >
        <div className="drawer-header">
          <div id="modal-shell-title" className="drawer-title">{title}</div>
          <button type="button" className="drawer-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {subtitle && <p className="drawer-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}

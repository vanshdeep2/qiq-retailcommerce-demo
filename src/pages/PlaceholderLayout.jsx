import Nav from '../components/Nav'
import FlowBar from '../components/FlowBar'
import { CALLS_PILL, LIVE_LABEL } from '../data/executiveConstants'
import '../styles/executive.css'

export default function PlaceholderLayout({
  currentPage,
  activeFlowPage,
  pageTitle,
  subtitle,
  children,
}) {
  return (
    <>
      <Nav
        currentPage={currentPage}
        liveLabel={LIVE_LABEL}
        callsPill={CALLS_PILL}
        pageTitle={pageTitle}
      />
      <div className="page">
        {subtitle && <div className="briefing-subtitle">{subtitle}</div>}
        <div className="placeholder-message">{children || 'Coming soon'}</div>
        <FlowBar activePage={activeFlowPage} />
      </div>
    </>
  )
}

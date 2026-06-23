import { Link } from 'react-router-dom'
import '../styles/components.css'

const STEPS = [
  { id: 'executive', path: '/', label: 'Insight - Executive Intelligence' },
  { id: 'teamlead', path: '/teamlead', label: 'Action - Team Leader View' },
  { id: 'agent', path: '/agent', label: 'Learning - Agent Coaching' },
  { id: 'ccm', path: '/ccm', label: 'Improvement - CCM Director' },
]

export default function FlowBar({ activePage }) {
  return (
    <div className="flow-bar">
      {STEPS.map((step, index) => (
        <span key={step.id} style={{ display: 'contents' }}>
          {index > 0 && <span className="flow-arrow">→</span>}
          {activePage === step.id ? (
            <span className="flow-step active">{step.label}</span>
          ) : (
            <Link className="flow-step" to={step.path}>
              {step.label}
            </Link>
          )}
        </span>
      ))}
    </div>
  )
}

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Executive from './pages/Executive'
import CCM from './pages/CCM'
import TeamLead from './pages/TeamLead'
import Agent from './pages/Agent'
import ContactSearch from './pages/ContactSearch'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Executive />} />
        <Route path="/ccm" element={<CCM />} />
        <Route path="/teamlead" element={<TeamLead />} />
        <Route path="/agent" element={<Agent />} />
        <Route path="/agent/:agentSlug" element={<Agent />} />
        <Route path="/search" element={<ContactSearch />} />
      </Routes>
    </BrowserRouter>
  )
}

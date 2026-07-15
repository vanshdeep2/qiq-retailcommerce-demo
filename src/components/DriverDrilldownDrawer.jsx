import ModalShell from './ModalShell'
import { driverSignal, fcrClass } from '../utils/drivers'
import { formatAht } from '../utils/format'
import '../styles/executive.css'

export default function DriverDrilldownDrawer({ open, onClose, category, l2Rows, showAht = true }) {
  if (!category) return null

  const maxVol = Math.max(...(l2Rows.map((r) => r.volume)), 1)

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={category}
      subtitle="Level 2 driver breakdown · volume and share within category"
      panelClassName="driver-drilldown-drawer"
      size="sm"
    >
      <div className="drawer-section">
        <table className="drivers-table drivers-table--l2">
          <thead>
            <tr>
              <th>Driver</th>
              <th>Volume</th>
              <th>Share</th>
              <th>FCR</th>
              <th>AHT</th>
              <th>Signal</th>
            </tr>
          </thead>
          <tbody>
            {l2Rows.map((row) => {
              const sig = driverSignal(row)
              const barPct = Math.round((row.volume / maxVol) * 100)
              const barCls = sig.cls === 'signal-green' ? 'vol-bar vol-bar-green' : 'vol-bar'
              return (
                <tr key={row.name}>
                  <td className="subcat-name">{row.name}</td>
                  <td>
                    <div className="vol-cell">
                      <span className="vol-num">{row.volume.toLocaleString()}</span>
                      <div className="vol-bar-wrap">
                        <div className={barCls} style={{ width: `${barPct}%` }} />
                      </div>
                    </div>
                  </td>
                  <td>{row.share}%</td>
                  <td className={fcrClass(row.fcr)}>{row.fcr}%</td>
                  <td className={showAht && row.aht > 480 ? 'aht-bad' : 'aht-ok'}>
                    {showAht ? formatAht(row.aht) : 'n/a'}
                  </td>
                  <td>
                    <span className={`signal-badge ${sig.cls}`}>{sig.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </ModalShell>
  )
}

export default function LedgerTable({ columns, rows, tableClassName = '', summary }) {
  return (
    <div className="ledger-panel">
      <div className="ledger-table-wrap">
        <table className={`ledger-table ${tableClassName}`.trim()}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
      {summary && summary.length > 0 && (
        <div className="ledger-summary">
          {summary.map((chip) => (
            <span key={chip.text} className={chip.className}>
              {chip.text}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

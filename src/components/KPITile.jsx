import '../styles/components.css'

const colourMap = {
  green: { val: 'val-green', chg: 'chg-green' },
  amber: { val: 'val-amber', chg: 'chg-amber' },
  red: { val: 'val-red', chg: 'chg-red' },
  muted: { val: '', chg: '' },
}

export default function KPITile({
  label,
  value,
  target,
  variance,
  varianceDirection,
  colour = 'muted',
  tooltip,
  onClick,
  drillLabel = 'Details →',
  changeText,
  children,
}) {
  const classes = colourMap[colour] || colourMap.muted
  const Wrapper = onClick ? 'button' : 'div'
  const wrapperProps = onClick ? { type: 'button', onClick } : {}

  return (
    <Wrapper className="trend-card" {...wrapperProps}>
      <div className="trend-top">
        <div>
          <div className="trend-label">
            {label}
            {tooltip && (
              <span className="kpi-info-btn" style={{ display: 'inline-flex', marginLeft: 6, verticalAlign: 'middle' }}>
                i
                <span className="kpi-tooltip">{tooltip}</span>
              </span>
            )}
          </div>
          <div className={`trend-val ${classes.val}`}>{value}</div>
          {target && <div className="trend-target">{target}</div>}
          {(variance || changeText) && (
            <div className={`trend-chg ${classes.chg}`}>
              {varianceDirection && (
                <span className="trend-arrow">{varianceDirection === 'up' ? '↑' : '↓'} </span>
              )}
              {changeText || variance}
            </div>
          )}
        </div>
        {onClick && <div className="trend-drill">{drillLabel}</div>}
      </div>
      {children && <div className="trend-chart">{children}</div>}
    </Wrapper>
  )
}

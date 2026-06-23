import FinancialDonut from './charts/FinancialDonut'
import { fmtDonutCentre } from '../utils/format'

export default function DonutWithCentre({
  data,
  colors,
  total,
  valueClass,
  label = '8 weeks',
  size = 120,
  cutout = '78%',
  animate = false,
  variant = 'card',
}) {
  const wrapClass = variant === 'drawer' ? 'donut-wrap donut-wrap--drawer' : 'donut-wrap'

  return (
    <div className={wrapClass}>
      <FinancialDonut data={data} colors={colors} size={size} cutout={cutout} animate={animate} />
      <div className="donut-centre">
        <div className={`donut-total ${valueClass}`}>{fmtDonutCentre(total)}</div>
        <div className="donut-total-lbl">{label}</div>
      </div>
    </div>
  )
}

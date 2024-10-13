import { Link } from 'react-router-dom'
import { BudgetSvg, HomeSvg, PieChartSvg, PlusSvg, SettingsSvg } from '@/assets'

const Toolbar = () => {
  return (
    <div className="toolbar">
      <Link to="/">
        <HomeSvg className="icon--stroke-primary" />
      </Link>
      <Link to="/reports">
        <PieChartSvg className="icon--stroke-primary" />
      </Link>
      <button className="toolbar__add-button btn">
        <PlusSvg className="icon--stroke-white" />
      </button>
      <Link to="/categories">
        <BudgetSvg className="icon--stroke-primary" />
      </Link>
      <Link to="/settings">
        <SettingsSvg className="icon--stroke-primary" />
      </Link>
    </div>
  )
}

export default Toolbar

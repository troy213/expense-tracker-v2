import { Link } from 'react-router-dom'
import { PieChartSvg, PlusSvg, SettingsSvg } from '@/assets'

const Toolbar = () => {
  return (
    <div className="toolbar">
      <Link to="/reports">
        <PieChartSvg className="icon--stroke-primary" />
      </Link>
      <button className="toolbar__add-button btn">
        <PlusSvg className="icon--stroke-white" />
      </button>
      <Link to="/settings">
        <SettingsSvg className="icon--stroke-primary" />
      </Link>
    </div>
  )
}

export default Toolbar

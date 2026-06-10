import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { GoalSvg, RecurringSvg, LoanSvg } from '@/assets'
import './DashboardLauncher.scss'

// Three quick-action tiles in a fixed 4-column grid; the 4th slot is
// intentionally left empty/reserved for a future feature.
const TILES = [
  { id: 'Goals', to: '/goals', Icon: GoalSvg },
  { id: 'Recurring', to: '/recurring', Icon: RecurringSvg },
  { id: 'Loans', to: '/loans', Icon: LoanSvg },
] as const

const DashboardLauncher = () => {
  const { formatMessage } = useIntl()

  return (
    <div className="dashboard-launcher">
      {TILES.map(({ id, to, Icon }) => (
        <Link key={id} to={to} className="dashboard-launcher__tile">
          <span className="dashboard-launcher__icon">
            <Icon className="icon--color-white" />
          </span>
          <span className="dashboard-launcher__label">
            {formatMessage({ id })}
          </span>
        </Link>
      ))}
    </div>
  )
}

export default DashboardLauncher

import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { GoalSvg, RecurringSvg, LoanSvg } from '@/assets'
import { useAppSelector } from '@/hooks'
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
  const pendingCount = useAppSelector(
    (s) =>
      s.recurringReducer.history.filter((r) => r.status === 'pending').length
  )

  return (
    <div className="dashboard-launcher">
      {TILES.map(({ id, to, Icon }) => (
        <Link key={id} to={to} className="dashboard-launcher__tile">
          <span className="dashboard-launcher__icon">
            <Icon className="icon--color-white" />
            {id === 'Recurring' && pendingCount > 0 && (
              <span
                className="dashboard-launcher__badge"
                data-testid="recurring-badge"
                aria-label={formatMessage(
                  { id: 'PendingRecurringCount' },
                  { count: pendingCount }
                )}
              >
                {pendingCount}
              </span>
            )}
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

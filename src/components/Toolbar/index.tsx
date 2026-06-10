import { Link, useLocation } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { BudgetSvg, HomeSvg, PieChartSvg, PlusSvg, SettingsSvg } from '@/assets'
import { combineClassName } from '@/utils'
import { useDisclosure } from '@/hooks'
import { FormModal } from '@/components'
import './index.scss'

const Toolbar = () => {
  const addModal = useDisclosure()
  const { formatMessage } = useIntl()

  const currentMenu = useLocation().pathname

  const getClassName = (route: string) =>
    combineClassName('toolbar__menu', [
      { condition: currentMenu === route, className: 'selected' },
    ])

  return (
    <div className="toolbar">
      <FormModal.FormTransaction
        isOpen={addModal.isOpen}
        onClose={addModal.close}
        onCancel={addModal.close}
      />

      <Link
        to="/"
        className={getClassName('/')}
        aria-label={formatMessage({ id: 'Dashboard' })}
      >
        <HomeSvg className="icon--color-primary" />
      </Link>
      <Link
        to="/reports"
        className={getClassName('/reports')}
        aria-label={formatMessage({ id: 'Reports' })}
      >
        <PieChartSvg className="icon--color-primary" />
      </Link>

      <div className="toolbar__menu">
        <button
          className="toolbar__add-button"
          onClick={addModal.toggle}
          aria-label={formatMessage({ id: 'AddTransaction' })}
        >
          <PlusSvg className="icon--color-white" />
        </button>
      </div>

      <Link
        to="/categories"
        className={getClassName('/categories')}
        aria-label={formatMessage({ id: 'CategoryAndBudget' })}
      >
        <BudgetSvg className="icon--color-primary" />
      </Link>
      <Link
        to="/settings"
        className={getClassName('/settings')}
        aria-label={formatMessage({ id: 'Settings' })}
      >
        <SettingsSvg className="icon--color-primary" />
      </Link>
    </div>
  )
}

export default Toolbar

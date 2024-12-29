import { Link, useLocation } from 'react-router-dom'
import { BudgetSvg, HomeSvg, PieChartSvg, PlusSvg, SettingsSvg } from '@/assets'
import { useState } from 'react'
import InputTransactionModal from '../Modal/InputTransactionModal'
import { combineClassName } from '@/utils'

const Toolbar = () => {
  const [isOpen, setOpen] = useState(false)

  const currentMenu = useLocation().pathname

  const getClassName = (route: string) =>
    combineClassName('toolbar__menu', [
      { condition: currentMenu === route, className: 'selected' },
    ])

  return (
    <div className="toolbar">
      <div className={getClassName('/')}>
        <InputTransactionModal
          isOpen={isOpen}
          handleOpenModal={(val) => {
            setOpen(val)
          }}
        />

        <Link to="/">
          <HomeSvg className="icon--stroke-primary" />
        </Link>
      </div>
      <div className={getClassName('/reports')}>
        <Link to="/reports">
          <PieChartSvg className="icon--stroke-primary" />
        </Link>
      </div>
      <div className="toolbar__menu">
        <button
          className="toolbar__add-button"
          onClick={() => {
            setOpen((val) => !val)
          }}
        >
          <PlusSvg className="icon--stroke-white" />
        </button>
      </div>
      <div className={getClassName('/categories')}>
        <Link to="/categories">
          <BudgetSvg className="icon--stroke-primary" />
        </Link>
      </div>
      <div className={getClassName('/settings')}>
        <Link to="/settings">
          <SettingsSvg className="icon--stroke-primary" />
        </Link>
      </div>
    </div>
  )
}

export default Toolbar

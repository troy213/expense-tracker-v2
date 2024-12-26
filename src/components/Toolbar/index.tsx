// import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BudgetSvg, HomeSvg, PieChartSvg, PlusSvg, SettingsSvg } from '@/assets'
// import Modal from '../Modal'
import { useState } from 'react'
import AddtransactionModal from '../Modal/AddTransaction'
import { combineClassName } from '@/utils'

const Toolbar = () => {
  const [isOpen, setOpen] = useState(false)

  const currentMenu = useLocation().pathname

  const handleOpenModal = () => {
    setOpen(!isOpen)
    document.getElementsByTagName('body')[0].classList.toggle('hide')
  }

  const getClassName = (route: string) =>
    combineClassName('toolbar__menu', [
      { condition: currentMenu === route, className: 'selected' },
    ])

  return (
    <div className="toolbar">
      <div className={getClassName('/')}>
        <Link to="/">
          <HomeSvg className="icon--stroke-primary" />
        </Link>
      </div>
      <div className={getClassName('/reports')}>
        <Link to="/reports">
          <PieChartSvg className="icon--stroke-primary" />
        </Link>
      </div>
      <div>
        <button
          className="toolbar__add-button btn"
          onClick={() => {
            handleOpenModal()
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
      <AddtransactionModal isOpen={isOpen} handleOpenModal={handleOpenModal} />
    </div>
  )
}

export default Toolbar

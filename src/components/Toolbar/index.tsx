// import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BudgetSvg, HomeSvg, PieChartSvg, PlusSvg, SettingsSvg } from '@/assets'
// import Modal from '../Modal'
import { useState } from 'react'
import AddtransactionModal from '../Modal/AddTransaction'

const Toolbar = () => {
  const [isOpen, setOpen] = useState(false)

  const handleOpenModal = () => {
    setOpen(!isOpen)
    document.getElementsByTagName('body')[0].classList.toggle('hide')
  }
  return (
    <div className="toolbar">
      <Link to="/">
        <HomeSvg className="icon--stroke-primary" />
      </Link>
      <Link to="/reports">
        <PieChartSvg className="icon--stroke-primary" />
      </Link>
      <button
        className="toolbar__add-button btn"
        onClick={() => {
          handleOpenModal()
        }}
      >
        <PlusSvg className="icon--stroke-white" />
      </button>
      <Link to="/categories">
        <BudgetSvg className="icon--stroke-primary" />
      </Link>
      <Link to="/settings">
        <SettingsSvg className="icon--stroke-primary" />
      </Link>
      <AddtransactionModal isOpen={isOpen} handleOpenModal={handleOpenModal} />
    </div>
  )
}

export default Toolbar

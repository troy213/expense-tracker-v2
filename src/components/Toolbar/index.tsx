import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BudgetSvg, HomeSvg, PieChartSvg, PlusSvg, SettingsSvg } from '@/assets'
import Modal from '../Modal'

const Toolbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddModal = () => {
    setIsModalOpen((val) => !val)
  }

  return (
    <div className="toolbar">
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <span>Add</span>
        </Modal>
      )}
      <Link to="/">
        <HomeSvg className="icon--stroke-primary" />
      </Link>
      <Link to="/reports">
        <PieChartSvg className="icon--stroke-primary" />
      </Link>
      <button className="toolbar__add-button btn" onClick={handleAddModal}>
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

import { Link, useLocation } from 'react-router-dom'
import { BudgetSvg, HomeSvg, PieChartSvg, PlusSvg, SettingsSvg } from '@/assets'
import { combineClassName } from '@/utils'
import { useDisclosure } from '@/hooks'
import { FormModal } from '@/components'
import Modal from '../Modal'

const Toolbar = () => {
  const addModal = useDisclosure()

  const currentMenu = useLocation().pathname

  const getClassName = (route: string) =>
    combineClassName('toolbar__menu', [
      { condition: currentMenu === route, className: 'selected' },
    ])

  return (
    <div className="toolbar">
      <Modal isOpen={addModal.isOpen} onClose={addModal.close}>
        <FormModal.FormTransaction onCancel={addModal.close} />
      </Modal>

      <Link to="/" className={getClassName('/')}>
        <HomeSvg className="icon--stroke-primary" />
      </Link>
      <Link to="/reports" className={getClassName('/reports')}>
        <PieChartSvg className="icon--stroke-primary" />
      </Link>

      <div className="toolbar__menu">
        <button className="toolbar__add-button" onClick={addModal.toggle}>
          <PlusSvg className="icon--stroke-white" />
        </button>
      </div>

      <Link to="/categories" className={getClassName('/categories')}>
        <BudgetSvg className="icon--stroke-primary" />
      </Link>
      <Link to="/settings" className={getClassName('/settings')}>
        <SettingsSvg className="icon--stroke-primary" />
      </Link>
    </div>
  )
}

export default Toolbar

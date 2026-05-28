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
      <div className={getClassName('/')}>
        <Modal isOpen={addModal.isOpen} onClose={addModal.close}>
          <FormModal.FormTransaction onCancel={addModal.close} />
        </Modal>

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
        <button className="toolbar__add-button" onClick={addModal.toggle}>
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

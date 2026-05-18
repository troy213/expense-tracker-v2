import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { SETTING_MENUS } from '@/constants/config'
import { Navbar } from '@/components'
import DeleteDataModal from '@/components/Modal/DeleteDataModal'
import ExportDataModal from '@/components/Modal/ExportDataModal'
import ImportDataModal from '@/components/Modal/ImportDataModal'
import { useAppDispatch } from '@/hooks'
import { deleteAllDBCategories } from '@/store/categories/categories-thunk'
import { deleteAllDBTransactions } from '@/store/main/main-thunk'

const SettingMenus = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedModal, setSelectedModal] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { formatMessage } = useIntl()

  const handleDelete = () => {
    setIsModalOpen(false)
    dispatch(deleteAllDBCategories())
    dispatch(deleteAllDBTransactions())
    navigate('/')
  }

  const renderModal = () => {
    switch (selectedModal) {
      case 'ImportData':
        return (
          <ImportDataModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        )
      case 'ExportData':
        return (
          <ExportDataModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        )
      case 'DeleteData':
        return (
          <DeleteDataModal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            title={formatMessage({ id: 'DeleteData' })}
            message={formatMessage({ id: 'DeleteDataGeneral' })}
            handleDelete={handleDelete}
          />
        )
      default:
        return <></>
    }
  }

  return (
    <div className="setting-menus">
      {isModalOpen && renderModal()}
      <Navbar title="Settings" enableBackButton={true} />

      <ul className="flex-column gap-8 py-4">
        {SETTING_MENUS.map((menu, index) => {
          const {
            title,
            titleClassName,
            className,
            Icon,
            iconClassName,
            link = '',
          } = menu

          const handleClick = () => {
            setSelectedModal(title)
            setIsModalOpen(true)
          }

          return (
            <li className={className} key={index}>
              <Link to={link}>
                <button
                  type="button"
                  className="btn btn-clear"
                  onClick={handleClick}
                >
                  <div className="flex-align-center gap-2">
                    <Icon className={iconClassName} />
                    <span className={titleClassName}>
                      {formatMessage({ id: title })}
                    </span>
                  </div>
                </button>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SettingMenus

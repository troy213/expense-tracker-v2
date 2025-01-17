import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Navbar } from '@/components'
import DeleteDataModal from '@/components/Modal/DeleteDataModal'
import { SETTING_MENUS } from '@/constants/config'
import { useAppDispatch } from '@/hooks'
import { mainAction } from '@/store/main/main-slice'
import { categoriesAction } from '@/store/categories/categories-slice'
import { setStorage } from '@/utils'

const SettingMenus = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedModal, setSelectedModal] = useState('')
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const handleDelete = () => {
    setStorage('data', '')
    setStorage('categories', '')
    dispatch(mainAction.resetState())
    dispatch(categoriesAction.resetState())
    setIsModalOpen(false)
  }

  const renderModal = () => {
    switch (selectedModal) {
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
      {renderModal()}
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

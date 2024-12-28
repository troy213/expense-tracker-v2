import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Navbar } from '@/components'
import DeleteAllDataModal from '@/components/Modal/DeleteAllDataModal'
import { SETTING_MENUS } from '@/constants/config'

const SettingMenus = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedModal, setSelectedModal] = useState('')
  const { formatMessage } = useIntl()

  const renderModal = () => {
    switch (selectedModal) {
      case 'DeleteData':
        return (
          <DeleteAllDataModal
            isModalOpen={isModalOpen}
            handleOpenModal={setIsModalOpen}
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

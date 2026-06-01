import { Link, useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { ChevronDownSvg, TrashSvg } from '@/assets'
import { SETTING_MENUS } from '@/constants/config'
import { Navbar } from '@/components'
import DeleteDataModal from '@/components/Modal/DeleteDataModal'
import ExportDataModal from '@/components/Modal/ExportDataModal'
import ImportDataModal from '@/components/Modal/ImportDataModal'
import { useAppDispatch, useAppSelector, useDisclosure } from '@/hooks'
import { deleteAllDBCategories } from '@/store/categories/categories-thunk'
import { deleteAllDBTransactions } from '@/store/transactions/transactions-thunk'
import {
  getLanguageTranslationKey,
  getStorage,
  getThemeTranslationKey,
} from '@/utils'

const SettingMenus = () => {
  const { locale, theme } = useAppSelector((state) => state.configReducer)
  const modal = useDisclosure<string>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { formatMessage } = useIntl()

  const handleDelete = () => {
    modal.close()
    dispatch(deleteAllDBCategories())
    dispatch(deleteAllDBTransactions())
    navigate('/')
  }

  const getMenuValue = (menu: string): string => {
    switch (menu) {
      case 'Theme':
        return getThemeTranslationKey(theme)
      case 'Language':
        return getLanguageTranslationKey(locale)
      default:
        return ''
    }
  }

  const lastDownload = getStorage('lastDownload')

  const getSubtitleValue = (menu: string): string => {
    switch (menu) {
      case 'ExportData':
        return lastDownload
          ? formatMessage(
              { id: 'LastDownload' },
              { date: new Date(lastDownload).toLocaleString() }
            )
          : ''
      default:
        return ''
    }
  }

  const renderModal = () => {
    switch (modal.data) {
      case 'ImportData':
        return <ImportDataModal isOpen={modal.isOpen} onClose={modal.close} />
      case 'ExportData':
        return <ExportDataModal isOpen={modal.isOpen} onClose={modal.close} />
      case 'DeleteData':
        return (
          <DeleteDataModal
            isOpen={modal.isOpen}
            onClose={modal.close}
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
      {modal.isOpen && renderModal()}
      <Navbar title="Settings" enableBackButton={true} />

      <ul className="flex-column gap-4 py-4">
        {SETTING_MENUS.map((section, sectionIndex) => {
          const { title, menus } = section

          return (
            <div className="flex-column gap-2" key={sectionIndex}>
              <span className="text--uppercase text--light text--3">
                {formatMessage({ id: title })}
              </span>

              <div className="setting-menus__widget">
                {menus.map((menu, menuIndex) => {
                  const {
                    Icon,
                    title: menuTitle,
                    className,
                    iconClassName,
                    link,
                    modal: modalKey,
                    titleClassName,
                    disableChevron,
                  } = menu

                  const subtitle = getSubtitleValue(menuTitle)
                  const menuValue = getMenuValue(menuTitle)

                  const content = (
                    <span className="setting-menus__item">
                      <span className="flex-align-center gap-4">
                        <Icon className={iconClassName} />
                        <div className="flex-column flex-align-start gap-2">
                          <span className={titleClassName}>
                            {formatMessage({ id: menuTitle })}
                          </span>
                          {subtitle && (
                            <span className="setting-menus__subtitle text--italic">
                              {subtitle}
                            </span>
                          )}
                        </div>
                      </span>

                      <div className="flex-align-center gap-2">
                        {menuValue && (
                          <span className="setting-menus__menu-value">
                            {menuValue}
                          </span>
                        )}
                        {!disableChevron && (
                          <ChevronDownSvg className="setting-menus__chevron icon--stroke-primary" />
                        )}
                      </div>
                    </span>
                  )

                  return (
                    <li className={className} key={menuIndex}>
                      {link ? (
                        <Link to={link}>{content}</Link>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-clear width-100"
                          onClick={() => modal.open(modalKey)}
                        >
                          {content}
                        </button>
                      )}
                    </li>
                  )
                })}
              </div>
            </div>
          )
        })}

        <button
          type="button"
          className="setting-menus__delete-btn"
          onClick={() => modal.open('DeleteData')}
        >
          <TrashSvg className="icon--lg icon--stroke-danger" />
          <span className="text--4 text--color-danger">
            {formatMessage({ id: 'DeleteData' })}
          </span>
        </button>
      </ul>
    </div>
  )
}

export default SettingMenus

import { Link } from 'react-router-dom'
import { Navbar } from '@/components'
import { SETTING_MENUS } from '@/constants/config'
import { useIntl } from 'react-intl'

const SettingMenus = () => {
  const { formatMessage } = useIntl()
  return (
    <div className="setting-menus">
      <Navbar title="Settings" enableBackButton={true} />

      <ul className="flex-column gap-8 py-4">
        {SETTING_MENUS.map((menu, index) => {
          const {
            title,
            titleClassName,
            className,
            Icon,
            iconClassName,
            callback,
            link = '',
          } = menu

          return (
            <li className={className} key={index}>
              <Link to={link}>
                <button
                  type="button"
                  className="btn btn-clear"
                  onClick={callback}
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

import { Outlet } from 'react-router-dom'
import { Toolbar } from '@/components'
import About from './About'
import Languages from './Languages'
import SettingMenus from './SettingMenus'
import Theme from './Theme'

const Settings = () => {
  const appVersion = import.meta.env.APP_VERSION

  return (
    <div className="settings">
      <Outlet />
      <div>
        <div className="flex-justify-center">
          <span className="text--light text--3 py-4">v{appVersion}</span>
        </div>
        <Toolbar />
      </div>
    </div>
  )
}

export { About, Languages, SettingMenus, Theme }

export default Settings

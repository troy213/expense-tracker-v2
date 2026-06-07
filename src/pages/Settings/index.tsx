import { Outlet } from 'react-router-dom'
import './index.scss'

const Settings = () => {
  const appVersion = import.meta.env.APP_VERSION

  return (
    <div className="settings">
      <Outlet />
      <div>
        <div className="flex-justify-center">
          <span className="text--light text--3 py-4">v{appVersion}</span>
        </div>
      </div>
    </div>
  )
}

export default Settings

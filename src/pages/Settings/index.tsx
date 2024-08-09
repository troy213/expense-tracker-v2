import {
  CoinsSvg,
  ExportSvg,
  GlobeSvg,
  ImportSvg,
  PaletteSvg,
  TrashSvg,
} from '@/assets'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Navbar, Toolbar } from '@/components'

interface ThemeProps {
  theme: string
}

const Settings: React.FC<ThemeProps> = ({ theme }) => {
  const location = useLocation()
  const isThemeOrLang =
    location.pathname.includes('/settings/theme') ||
    location.pathname.includes('/settings/language')
  const appVersion = import.meta.env.APP_VERSION

  return (
    <div className={`settings ${theme === 'dark' ? 'dark' : ''}`}>
      <Outlet />
      {!isThemeOrLang && (
        <>
          <div className="flex-column gap-8 p-4">
            <Navbar title="Settings" enableBackButton={true} />

            <ul className="flex-column gap-8 py-4">
              <li>
                <button type="button" className="btn btn-clear">
                  <div className="flex-align-center gap-2">
                    <CoinsSvg className="icon--stroke-primary" />
                    <span>Category & Budget</span>
                  </div>
                </button>
              </li>
              <li>
                <button type="button" className="btn btn-clear">
                  <div className="flex-align-center gap-2">
                    <ImportSvg className="icon--stroke-primary" />
                    <span>Import Data (.xls)</span>
                  </div>
                </button>
              </li>
              <li>
                <button type="button" className="btn btn-clear">
                  <div className="flex-align-center gap-2">
                    <ExportSvg className="icon--stroke-primary" />
                    <span>Export Data (.xls)</span>
                  </div>
                </button>
              </li>
              <li>
                <Link to="theme">
                  <button type="button" className="btn btn-clear">
                    <div className="flex-align-center gap-2">
                      <PaletteSvg className="icon--stroke-primary" />
                      <span>Theme</span>
                    </div>
                  </button>
                </Link>
              </li>
              <li>
                <Link to="language">
                  <button type="button" className="btn btn-clear">
                    <div className="flex-align-center gap-2">
                      <GlobeSvg className="icon--stroke-primary" />
                      <span>Language</span>
                    </div>
                  </button>
                </Link>
              </li>
              <li className="mt-6">
                <button type="button" className="btn btn-clear">
                  <div className="flex-align-center gap-2">
                    <TrashSvg className="icon--stroke-danger" />
                    <span className="text--color-danger">Delete Data</span>
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
      <div>
        <div className="flex-justify-center">
          <span className="text--light text--3 py-4">v{appVersion}</span>
        </div>
        <Toolbar />
      </div>
    </div>
  )
}

export default Settings

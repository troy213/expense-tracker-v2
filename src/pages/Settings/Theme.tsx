import { Navbar } from '@/components'
import useAppDispatch from '@/hooks/useAppDispatch'
import useAppSelector from '@/hooks/useAppSelector'
import { themeAction } from '@/store/theme/theme-slice'

const Theme: React.FC = () => {
  const theme = useAppSelector((state) => state.themeReducer.theme)
  const dispatch = useAppDispatch()
  const OnThemeChange = () => {
    dispatch(themeAction.toggleTheme())
  }

  return (
    <div className="flex-column gap-8 p-4">
      <Navbar title="Theme" enableBackButton={true} />

      <ul className="flex-column gap-8 py-4">
        <li>
          <button type="button" className="btn btn-clear">
            <div className="flex-align-center gap-2">
              <input
                type="radio"
                id="light"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={OnThemeChange}
              />
              <label htmlFor="light">Light Theme</label>
            </div>
          </button>
        </li>
        <li>
          <button type="button" className="btn btn-clear">
            <div className="flex-align-center gap-2">
              <input
                type="radio"
                id="dark"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={OnThemeChange}
              />
              <label htmlFor="dark">Dark Theme</label>
            </div>
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Theme

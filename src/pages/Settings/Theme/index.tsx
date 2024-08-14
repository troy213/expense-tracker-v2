import { Navbar } from '@/components'
import useAppDispatch from '@/hooks/useAppDispatch'
import useAppSelector from '@/hooks/useAppSelector'
import { mainAction } from '@/store/main/main-slice'

const Theme = () => {
  const theme = useAppSelector((state) => state.mainReducer.theme)
  const dispatch = useAppDispatch()

  const toggleTheme = (selectedTheme: 'light' | 'dark') => {
    dispatch(mainAction.setState({ state: 'theme', value: selectedTheme }))
  }

  return (
    <div className="theme">
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
                onChange={() => toggleTheme('light')}
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
                onChange={() => toggleTheme('dark')}
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

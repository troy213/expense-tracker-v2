import { useIntl } from 'react-intl'
import { Navbar } from '@/components'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { mainAction } from '@/store/main/main-slice'
import { Theme as ThemeType } from '@/types'

const Theme = () => {
  const theme = useAppSelector((state) => state.mainReducer.theme)
  const dispatch = useAppDispatch()

  const toggleTheme = (selectedTheme: ThemeType) => {
    dispatch(mainAction.setState({ state: 'theme', value: selectedTheme }))
  }
  const { formatMessage } = useIntl()

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
              <label htmlFor="light">
                {formatMessage({ id: 'LightTheme' })}
              </label>
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
              <label htmlFor="dark">{formatMessage({ id: 'DarkTheme' })}</label>
            </div>
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Theme

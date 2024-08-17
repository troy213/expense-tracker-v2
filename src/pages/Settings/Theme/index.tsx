import { useIntl } from 'react-intl'
import { Navbar } from '@/components'
import { THEME } from '@/constants'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { mainAction } from '@/store/main/main-slice'
import { Theme as ThemeType } from '@/types'

const Theme = () => {
  const theme = useAppSelector((state) => state.mainReducer.theme)
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const toggleTheme = (selectedTheme: ThemeType) => {
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
                id={THEME.LIGHT}
                name="theme"
                value={THEME.LIGHT}
                checked={theme === THEME.LIGHT}
                onChange={() => toggleTheme(THEME.LIGHT)}
              />
              <label htmlFor={THEME.LIGHT}>
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
                id={THEME.DARK}
                name="theme"
                value={THEME.DARK}
                checked={theme === THEME.DARK}
                onChange={() => toggleTheme(THEME.DARK)}
              />
              <label htmlFor={THEME.DARK}>
                {formatMessage({ id: 'DarkTheme' })}
              </label>
            </div>
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Theme

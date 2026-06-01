import { useIntl } from 'react-intl'
import { MoonSvg, SunSvg } from '@/assets'
import { Navbar } from '@/components'
import { THEME } from '@/constants'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { configAction } from '@/store/config/config-slice'
import { Theme as ThemeType } from '@/types'

const Theme = () => {
  const theme = useAppSelector((state) => state.configReducer.theme)
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const toggleTheme = (selectedTheme: ThemeType) => {
    dispatch(configAction.setTheme(selectedTheme))
  }

  return (
    <div className="theme">
      <Navbar title="Theme" enableBackButton={true} />

      <div className="flex-column gap-2">
        <span className="text--uppercase text--light text--3">
          {formatMessage({ id: 'Appearance' })}
        </span>
        <ul className="theme__widget">
          <li>
            <div className="flex-space-between flex-align-center gap-2">
              <label htmlFor={THEME.LIGHT} className="flex-align-center gap-4">
                <SunSvg className="icon--stroke-primary" />
                <span>{formatMessage({ id: 'LightTheme' })}</span>
              </label>
              <input
                type="radio"
                id={THEME.LIGHT}
                name="theme"
                value={THEME.LIGHT}
                checked={theme === THEME.LIGHT}
                onChange={() => toggleTheme(THEME.LIGHT)}
              />
            </div>
          </li>
          <li>
            <div className="flex-space-between flex-align-center gap-2">
              <label htmlFor={THEME.DARK} className="flex-align-center gap-4">
                <MoonSvg className="icon--stroke-primary" />
                <span>{formatMessage({ id: 'DarkTheme' })}</span>
                <span className="text--italic text--light text--3">
                  ({formatMessage({ id: 'Experimental' })})
                </span>
              </label>
              <input
                type="radio"
                id={THEME.DARK}
                name="theme"
                value={THEME.DARK}
                checked={theme === THEME.DARK}
                onChange={() => toggleTheme(THEME.DARK)}
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Theme

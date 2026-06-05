import { useIntl } from 'react-intl'
import { MoonSvg, SunSvg, SystemThemeSvg } from '@/assets'
import { Navbar } from '@/components'
import { THEME } from '@/constants'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { configAction } from '@/store/config/config-slice'
import { Theme as ThemeType } from '@/types'
import './index.scss'

// Registry of selectable themes, in display order. To add a new theme:
//   1. add its value to the `Theme` union (src/types) and `THEME` (src/constants)
//   2. add a `[data-theme='<value>']` token block in src/styles/_tokens.scss
//   3. add an i18n label (id used below) in src/locales/*
//   4. add an entry here — the radio list renders from this array
const THEME_OPTIONS: {
  value: ThemeType
  labelId: string
  Icon: typeof SunSvg
}[] = [
  { value: THEME.SYSTEM, labelId: 'SystemTheme', Icon: SystemThemeSvg },
  { value: THEME.LIGHT, labelId: 'LightTheme', Icon: SunSvg },
  { value: THEME.DARK, labelId: 'DarkTheme', Icon: MoonSvg },
]

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
          {THEME_OPTIONS.map(({ value, labelId, Icon }) => (
            <li key={value}>
              <div className="flex-space-between flex-align-center gap-2">
                <label htmlFor={value} className="flex-align-center gap-4">
                  <Icon className="icon--color-primary" />
                  <span>{formatMessage({ id: labelId })}</span>
                </label>
                <input
                  type="radio"
                  id={value}
                  name="theme"
                  value={value}
                  checked={theme === value}
                  onChange={() => toggleTheme(value)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Theme

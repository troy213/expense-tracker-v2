import { useIntl } from 'react-intl'
import { CheckSvg } from '@/assets'
import { Navbar } from '@/components'
import { LANGUAGES_MENU } from '@/constants/config'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { configAction } from '@/store/config/config-slice'
import { Locales } from '@/types'
import { combineClassName } from '@/utils'
import './index.scss'

const Languages = () => {
  const locale = useAppSelector((state) => state.configReducer.locale)
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const switchLanguage = (selectedLocale: Locales) => {
    dispatch(configAction.setLocale(selectedLocale))
  }

  return (
    <div className="languages">
      <Navbar title="Language" enableBackButton={true} />

      <div className="flex-column gap-2">
        <span className="text--uppercase text--light text--3">
          {formatMessage({ id: 'SelectLanguage' })}
        </span>
        <ul className="languages__widget">
          {LANGUAGES_MENU.map((item, index) => {
            const { Icon, title, locales } = item
            const isSelected = locales === locale
            const titleClassName = combineClassName('', [
              {
                condition: isSelected,
                className: 'text--bold',
              },
            ])

            return (
              <li className="flex-space-between" key={index}>
                <button
                  type="button"
                  className="btn btn-clear"
                  onClick={() => switchLanguage(locales)}
                >
                  <div className="flex-align-center gap-2">
                    <Icon />
                    <span className={titleClassName}>
                      {formatMessage({ id: title })}
                    </span>
                  </div>
                </button>
                {isSelected && <CheckSvg className="icon--color-primary" />}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Languages

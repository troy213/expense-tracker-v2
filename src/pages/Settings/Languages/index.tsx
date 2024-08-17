import { useIntl } from 'react-intl'
import { CheckSvg } from '@/assets'
import { Navbar } from '@/components'
import { LANGUAGES_MENU } from '@/constants/config'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { mainAction } from '@/store/main/main-slice'
import { Lang } from '@/types'
import { combineClassName } from '@/utils'

const Languages = () => {
  const lang = useAppSelector((state) => state.mainReducer.lang)
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const switchLanguage = (selectedLang: Lang) => {
    dispatch(mainAction.setState({ state: 'lang', value: selectedLang }))
  }

  return (
    <div className="languages">
      <Navbar title="Language" enableBackButton={true} />

      <ul className="flex-column gap-8 py-4">
        {LANGUAGES_MENU.map((item, index) => {
          const { Icon, title, langId } = item
          const isSelected = langId === lang
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
                onClick={() => switchLanguage(langId)}
              >
                <div className="flex-align-center gap-2">
                  <Icon />
                  <span className={titleClassName}>
                    {formatMessage({ id: title })}
                  </span>
                </div>
              </button>
              {isSelected && <CheckSvg className="icon--stroke-primary" />}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Languages

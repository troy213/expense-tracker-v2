import { CheckSvg, FlagIDSVg, FlagUKSvg } from '@/assets'
import { Navbar } from '@/components'
import useAppDispatch from '@/hooks/useAppDispatch'
import useAppSelector from '@/hooks/useAppSelector'
import { mainAction } from '@/store/main/main-slice'
import { useIntl } from 'react-intl'

const Languages = () => {
  const { formatMessage } = useIntl()
  const lang = useAppSelector((state) => state.mainReducer.lang)
  const dispatch = useAppDispatch()
  const switchLanguage = (selectedLang: string) => {
    dispatch(mainAction.setState({ state: 'lang', value: selectedLang }))
  }
  return (
    <div className="languages">
      <Navbar title="Language" enableBackButton={true} />

      <ul className="flex-column gap-8 py-4">
        <li className="flex-space-between">
          <button
            type="button"
            className="btn btn-clear"
            onClick={() => switchLanguage('en-US')}
          >
            <div className="flex-align-center gap-2">
              <FlagUKSvg />
              <span>{formatMessage({ id: 'English' })}</span>
            </div>
          </button>
          {lang === 'en-US' && <CheckSvg className="icon--stroke-primary" />}
        </li>
        <li className="flex-space-between">
          <button
            type="button"
            className="btn btn-clear"
            onClick={() => switchLanguage('id-ID')}
          >
            <div className="flex-align-center gap-2">
              <FlagIDSVg />
              <span>{formatMessage({ id: 'Indonesia' })}</span>
            </div>
          </button>
          {lang === 'id-ID' && <CheckSvg className="icon--stroke-primary" />}
        </li>
      </ul>
    </div>
  )
}

export default Languages

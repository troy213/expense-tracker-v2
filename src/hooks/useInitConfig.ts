import { useEffect } from 'react'
import useAppDispatch from './useAppDispatch'
import { LOCALES, THEME } from '@/constants'
import { mainAction } from '@/store/main/main-slice'
import { getStorage } from '@/utils'

const useInitConfig = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const storedTheme = getStorage('theme')
    const storedLocales = getStorage('locales')

    if (storedTheme === THEME.DARK || storedTheme === THEME.LIGHT) {
      dispatch(mainAction.setState({ state: 'theme', value: storedTheme }))
    }

    if (
      storedLocales === LOCALES.ENGLISH ||
      storedLocales === LOCALES.INDONESIA
    ) {
      dispatch(
        mainAction.setState({ state: 'selectedLocale', value: storedLocales })
      )
    }
  }, [dispatch])

  return
}

export default useInitConfig

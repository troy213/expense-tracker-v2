import { useEffect } from 'react'
import useAppDispatch from './useAppDispatch'
import { LOCALES, THEME } from '@/constants'
import { mainAction } from '@/store/main/main-slice'
import { getStorage, migrateDataToCategoryId } from '@/utils'
import { categoriesAction } from '@/store/categories/categories-slice'

const useInitConfig = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const storedTheme = getStorage('theme')
    const storedLocales = getStorage('locales')
    const storedData = getStorage('data')
    const storedCategories = getStorage('categories')
    const storedConfig = getStorage('config')

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

    if (storedData) {
      const parsedData = JSON.parse(storedData)
      // Migrate data from category name to category_id
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories)
        const migratedData = migrateDataToCategoryId(
          parsedData,
          parsedCategories
        )
        dispatch(mainAction.setState({ state: 'data', value: migratedData }))
      } else {
        dispatch(mainAction.setState({ state: 'data', value: parsedData }))
      }
    }

    if (storedCategories) {
      const parsedData = JSON.parse(storedCategories)
      dispatch(
        categoriesAction.setState({ state: 'categories', value: parsedData })
      )
    }

    if (storedConfig) {
      const parsedData = JSON.parse(storedConfig)
      dispatch(
        mainAction.setState({
          state: 'hideBalance',
          value: parsedData?.hideBalance,
        })
      )
    }
  }, [dispatch])

  return
}

export default useInitConfig

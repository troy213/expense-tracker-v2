import { useEffect } from 'react'
import { LOCALES, THEME } from '@/constants'
import { mainAction } from '@/store/main/main-slice'
import { categoriesAction } from '@/store/categories/categories-slice'
import dbServices from '@/lib/db'
import { getStorage, processMainData } from '@/utils'
import useAppDispatch from './useAppDispatch'

const useInitConfig = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const initializeData = async () => {
      // Initialize IndexedDB
      await dbServices.initializeDB()

      // Get theme and locale from localStorage
      const storedTheme = getStorage('theme')
      const storedLocales = getStorage('locales')
      const storedConfig = getStorage('config')

      if (storedTheme === THEME.DARK || storedTheme === THEME.LIGHT) {
        dispatch(mainAction.setState({ state: 'theme', value: storedTheme }))
      }

      if (
        storedLocales === LOCALES.ENGLISH ||
        storedLocales === LOCALES.INDONESIA
      ) {
        dispatch(
          mainAction.setState({
            state: 'selectedLocale',
            value: storedLocales,
          })
        )
      }

      // Load categories from IndexedDB or migrate from localStorage
      const categories = await dbServices.getAllCategories()

      if (categories.length > 0) {
        dispatch(
          categoriesAction.setState({ state: 'categories', value: categories })
        )
      }

      // Load transactions from IndexedDB or migrate from localStorage
      const transactions = await dbServices.getAllTransactions()

      if (transactions.length > 0) {
        // Load first 100 for initial display (pagination)
        // const displayTransactions = transactions.slice(0, 100)
        dispatch(
          mainAction.setState({
            state: 'data',
            value: processMainData(transactions),
          })
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

      dispatch(mainAction.setState({ state: 'isLoading', value: false }))
    }

    initializeData()
  }, [dispatch])

  return
}

export default useInitConfig

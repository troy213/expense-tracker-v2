import { useEffect } from 'react'
import useAppDispatch from './useAppDispatch'
import { LOCALES, THEME } from '@/constants'
import { mainAction } from '@/store/main/main-slice'
import { getStorage } from '@/utils'
import { categoriesAction } from '@/store/categories/categories-slice'

const useInitConfig = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const storedTheme = getStorage('theme')
    const storedLocales = getStorage('locales')
    const storedData = getStorage('data')
    const storedCategories = getStorage('categories')
    const storedTotalIncome = getStorage('totalIncome')
    const storedTotalExpense = getStorage('totalExpense')
    const storedTotalBalance = getStorage('totalBalance')

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
      dispatch(mainAction.setState({ state: 'data', value: parsedData }))
    }

    if (storedCategories) {
      const parsedData = JSON.parse(storedCategories)
      dispatch(
        categoriesAction.setState({ state: 'categories', value: parsedData })
      )
    }
    if (storedTotalIncome) {
      dispatch(
        mainAction.setState({
          state: 'totalIncome',
          value: parseFloat(storedTotalIncome),
        })
      )
    }
    if (storedTotalExpense) {
      dispatch(
        mainAction.setState({
          state: 'totalExpense',
          value: parseFloat(storedTotalExpense),
        })
      )
    }
    if (storedTotalBalance) {
      dispatch(
        mainAction.setState({
          state: 'totalBalance',
          value: parseFloat(storedTotalBalance),
        })
      )
    }
  }, [dispatch])

  return
}

export default useInitConfig

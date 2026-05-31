import { useEffect } from 'react'
import { mainAction } from '@/store/main/main-slice'
import { categoriesAction } from '@/store/categories/categories-slice'
import dbServices from '@/lib/db'
import { processMainData } from '@/utils'
import useAppDispatch from './useAppDispatch'

const useInitConfig = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const initializeData = async () => {
      // Initialize IndexedDB
      await dbServices.initializeDB()

      // Load categories from IndexedDB or migrate from localStorage
      const categories = await dbServices.categories.getCategoriesByIndex()

      if (categories.length > 0) {
        dispatch(
          categoriesAction.setState({
            state: 'categories',
            value: categories,
          })
        )
      }

      // Load transactions from IndexedDB or migrate from localStorage
      const transactions = await dbServices.transactions.getAllTransactions()

      if (transactions.length > 0) {
        dispatch(
          mainAction.setState({
            state: 'data',
            value: processMainData(transactions),
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

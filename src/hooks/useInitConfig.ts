import { useEffect } from 'react'
import dbServices from '@/lib/db'
import { getAllDBTransactions } from '@/store/transactions/transactions-thunk'
import { getAllDBCategories } from '@/store/categories/categories-thunk'
import useAppDispatch from './useAppDispatch'

const useInitConfig = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const initializeData = async () => {
      // Initialize IndexedDB
      await dbServices.initializeDB()

      // Load categories from IndexedDB or migrate from localStorage
      dispatch(getAllDBCategories())

      // Load transactions from IndexedDB or migrate from localStorage
      dispatch(getAllDBTransactions())
    }

    initializeData()
  }, [dispatch])

  return
}

export default useInitConfig

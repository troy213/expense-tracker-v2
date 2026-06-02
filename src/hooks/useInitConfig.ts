import { useEffect } from 'react'
import dbServices from '@/lib/db'
import { getAllDBTransactions } from '@/store/transactions/transactions-thunk'
import { getAllDBCategories } from '@/store/categories/categories-thunk'
import { getDBDashboardInfo } from '@/store/main/main-thunk'
import { getDBReportData } from '@/store/report/report-thunk'
import { configAction } from '@/store/config/config-slice'
import useAppDispatch from './useAppDispatch'

const useInitConfig = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const initializeData = async () => {
      // Initialize IndexedDB before any store reads it.
      await dbServices.initializeDB()

      // Load base data + derived dashboard/report in parallel. The derived
      // thunks read IndexedDB directly, so they don't depend on the base loads.
      // Awaiting all four guarantees every reducer is populated before we open
      // the render gate (no cold-start flash).
      await Promise.all([
        dispatch(getAllDBCategories()),
        dispatch(getAllDBTransactions()),
        dispatch(getDBDashboardInfo()),
        dispatch(getDBReportData({ dateFrom: null, dateTo: null })),
      ])

      // Open the render gate.
      dispatch(configAction.setInitialized(true))
    }

    initializeData()
  }, [dispatch])

  return
}

export default useInitConfig

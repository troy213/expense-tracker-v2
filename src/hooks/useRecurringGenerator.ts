import { useEffect } from 'react'
import { generateDBRecurring } from '@/store/recurring/recurring-thunk'
import useAppDispatch from './useAppDispatch'
import useAppSelector from './useAppSelector'
import useToday from './useToday'

/**
 * Runs the recurring generator once after bootstrap and again on every date
 * change while the app stays open. Mounted once at app level (App.tsx) — NOT
 * on a page — so midnight is caught on every route. The generator is
 * idempotent (add()-only), so doubled triggers are harmless.
 */
const useRecurringGenerator = () => {
  const dispatch = useAppDispatch()
  const today = useToday()
  const isInitialized = useAppSelector((s) => s.configReducer.isInitialized)

  useEffect(() => {
    if (isInitialized) dispatch(generateDBRecurring(today))
  }, [dispatch, isInitialized, today])
}

export default useRecurringGenerator

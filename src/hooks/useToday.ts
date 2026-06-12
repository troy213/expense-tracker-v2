import { useEffect, useState } from 'react'
import { getDate } from '@/utils'

/**
 * The current date as "YYYY-MM-DD", re-checked by a 1-second clock interval.
 * State changes only when the date actually rolls over, so consumers re-render
 * once per midnight, not per tick. Background throttling / PWA suspension only
 * delays a tick; the first tick after resume self-corrects, and a discarded
 * page reloads through bootstrap anyway.
 */
const useToday = (): string => {
  const [today, setToday] = useState(getDate)

  useEffect(() => {
    const id = setInterval(() => {
      const next = getDate()
      setToday((prev) => (prev === next ? prev : next))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return today
}

export default useToday

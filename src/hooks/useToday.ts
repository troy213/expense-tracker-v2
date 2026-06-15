import { useEffect, useState } from 'react'
import { getDate } from '@/utils'

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

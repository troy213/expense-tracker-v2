import { useCallback, useState } from 'react'

export interface UseDisclosureReturn<T> {
  isOpen: boolean
  data: T | undefined
  open: (data?: T) => void
  close: () => void
  toggle: () => void
}

const useDisclosure = <T = void>(): UseDisclosureReturn<T> => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<T>()

  const open = useCallback((payload?: T) => {
    setData(payload)
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  return { isOpen, data, open, close, toggle }
}

export default useDisclosure

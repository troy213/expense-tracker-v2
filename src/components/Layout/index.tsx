import { useState, useRef, useEffect, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { INITIAL_LOAD, LOAD_MORE_COUNT } from '@/constants/config'
import { useAppSelector } from '@/hooks'
import Toolbar from '../Toolbar'

type LayoutContextType = {
  displayCount: number
}

const Layout = () => {
  const { data } = useAppSelector((state) => state.mainReducer)
  const [displayCount, setDisplayCount] = useState(INITIAL_LOAD)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { pathname } = useLocation()

  // Handle scroll event for infinite scroll at Layout level with throttling
  const handleScroll = useCallback(() => {
    const container = contentRef.current
    if (!container) return

    // Check if user has scrolled near bottom
    const { scrollTop, scrollHeight, clientHeight } = container
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight

    // Load more when user is 300px from bottom
    if (distanceFromBottom < 300 && displayCount < data.length) {
      setDisplayCount((prev) => Math.min(prev + LOAD_MORE_COUNT, data.length))
    }
  }, [displayCount, data.length])

  useEffect(() => {
    const container = contentRef.current
    if (!container) return

    const throttledScroll = () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        handleScroll()
      }, 100)
    }

    container.addEventListener('scroll', throttledScroll)

    return () => {
      container.removeEventListener('scroll', throttledScroll)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [handleScroll])

  // Reset display count when data or the routes changes
  useEffect(() => {
    setDisplayCount(INITIAL_LOAD)
  }, [pathname, data.length])

  return (
    <div className="layout">
      <div className="layout__content" ref={contentRef}>
        <Outlet context={{ displayCount } as LayoutContextType} />
      </div>
      <Toolbar />
    </div>
  )
}

export default Layout

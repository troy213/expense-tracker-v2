import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Toolbar from '../Toolbar'
import './index.scss'

export type LayoutContextType = {
  // The scrollable content element, handed to children so a virtualized
  // list (react-virtuoso) can use it as its `customScrollParent`.
  scrollParent: HTMLElement | null
}

const Layout = () => {
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null)

  return (
    <div className="layout">
      <main className="layout__content" ref={setScrollParent}>
        <Outlet context={{ scrollParent } satisfies LayoutContextType} />
      </main>
      <Toolbar />
    </div>
  )
}

export default Layout

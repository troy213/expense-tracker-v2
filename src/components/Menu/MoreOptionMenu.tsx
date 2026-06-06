import { useLayoutEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { EditSvg, TrashSvg } from '@/assets'
import { combineClassName } from '@/utils'
import './MoreOptionMenu.scss'

type MoreOptionMenuProps = {
  handleEdit?: () => void
  handleDelete: () => void
}

// Minimum clearance the menu wants below itself before it flips upward —
// roughly the bottom toolbar height (~4rem) plus a small gap (~3rem). Kept in
// rem and converted to px against the root font-size at measure time.
const BOTTOM_SAFE_AREA_REM = 7

const remToPx = (rem: number) =>
  rem * parseFloat(getComputedStyle(document.documentElement).fontSize)

const MoreOptionMenu: React.FC<MoreOptionMenuProps> = ({
  handleEdit = () => {},
  handleDelete,
}) => {
  const { formatMessage } = useIntl()
  const menuRef = useRef<HTMLDivElement>(null)
  const [openUpward, setOpenUpward] = useState(false)

  useLayoutEffect(() => {
    const menu = menuRef.current
    if (!menu) return

    const spaceBelow = window.innerHeight - menu.getBoundingClientRect().bottom
    setOpenUpward(spaceBelow < remToPx(BOTTOM_SAFE_AREA_REM))
  }, [])

  const menuClassName = combineClassName('more-option-menu', [
    { condition: openUpward, className: 'menu--top' },
  ])

  return (
    <div className={menuClassName} ref={menuRef}>
      <button
        className="btn btn-clear text--color-primary"
        type="button"
        onClick={handleEdit}
      >
        <EditSvg className="icon icon--color-primary" />
        <span>{formatMessage({ id: 'Edit' })}</span>
      </button>
      <button
        className="btn btn-clear text--color-danger"
        type="button"
        onClick={handleDelete}
      >
        <TrashSvg className="icon icon--color-danger" />
        <span>{formatMessage({ id: 'Delete' })}</span>
      </button>
    </div>
  )
}

export default MoreOptionMenu

import { RefObject, useEffect } from 'react'

/**
 * Calls `handler` when a pointer/touch starts outside the referenced element.
 *
 * Listens on `mousedown`/`touchstart` (not `click`) so it fires before any
 * `onClick`/`onMouseDown` handlers inside the element resolve — matching how
 * dropdowns expect "click away to dismiss" to behave.
 *
 * The listeners are only attached while `enabled` is true, so an inactive
 * consumer (e.g. a closed dropdown) doesn't keep a global handler around.
 */
const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  handler: () => void,
  enabled = true
) => {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleEvent = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleEvent)
    document.addEventListener('touchstart', handleEvent)

    return () => {
      document.removeEventListener('mousedown', handleEvent)
      document.removeEventListener('touchstart', handleEvent)
    }
  }, [ref, handler, enabled])
}

export default useClickOutside

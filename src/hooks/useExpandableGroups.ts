import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Tracks which groups in a list are expanded, keyed by a stable id (via
 * `getKey`) instead of list index. Keying by id means the state survives a
 * virtualized list unmounting/recycling off-screen rows, and stays correct when
 * items are added or removed (indices shift, ids don't).
 *
 * Default expansion: the first `defaultExpandedCount` groups expand on first
 * load, and any group whose key hasn't been seen before auto-expands (e.g. a
 * brand-new date group), while the user's manual toggles on existing groups are
 * left untouched.
 *
 * `items` should be referentially stable (e.g. taken straight from the store)
 * so the seed/diff effect only runs when the data actually changes.
 */
const useExpandableGroups = <T>(
  items: T[],
  getKey: (item: T) => string,
  defaultExpandedCount = 0
) => {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set())
  // Every key seen so far; `null` until the initial defaults are seeded.
  const knownKeysRef = useRef<Set<string> | null>(null)
  // Held in a ref so a fresh `getKey` on each render doesn't re-run the effect.
  const getKeyRef = useRef(getKey)
  getKeyRef.current = getKey

  useEffect(() => {
    if (!items.length) {
      knownKeysRef.current = null
      setExpandedKeys(new Set())
      return
    }

    const currentKeys = items.map(getKeyRef.current)

    if (knownKeysRef.current === null) {
      knownKeysRef.current = new Set(currentKeys)
      setExpandedKeys(new Set(currentKeys.slice(0, defaultExpandedCount)))
      return
    }

    const known = knownKeysRef.current
    const newKeys = currentKeys.filter((key) => !known.has(key))
    knownKeysRef.current = new Set(currentKeys)

    if (newKeys.length) {
      setExpandedKeys((prev) => {
        const next = new Set(prev)
        newKeys.forEach((key) => next.add(key))
        return next
      })
    }
  }, [items, defaultExpandedCount])

  const toggle = useCallback((key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const isExpanded = useCallback(
    (key: string) => expandedKeys.has(key),
    [expandedKeys]
  )

  return { isExpanded, toggle }
}

export default useExpandableGroups

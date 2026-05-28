import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import useDisclosure from './useDisclosure'

describe('useDisclosure', () => {
  it('starts closed with no data', () => {
    const { result } = renderHook(() => useDisclosure())

    expect(result.current.isOpen).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('open() opens', () => {
    const { result } = renderHook(() => useDisclosure())

    act(() => result.current.open())

    expect(result.current.isOpen).toBe(true)
  })

  it('open(payload) stores the payload', () => {
    const { result } = renderHook(() => useDisclosure<string>())

    act(() => result.current.open('DeleteData'))

    expect(result.current.isOpen).toBe(true)
    expect(result.current.data).toBe('DeleteData')
  })

  it('close() closes', () => {
    const { result } = renderHook(() => useDisclosure())

    act(() => result.current.open())
    act(() => result.current.close())

    expect(result.current.isOpen).toBe(false)
  })

  it('toggle() flips the open state', () => {
    const { result } = renderHook(() => useDisclosure())

    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(true)

    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(false)
  })
})

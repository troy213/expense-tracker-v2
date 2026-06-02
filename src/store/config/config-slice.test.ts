import { describe, it, expect } from 'vitest'
import configSlice, { configAction } from './config-slice'

describe('configSlice — isInitialized', () => {
  it('defaults isInitialized to false', () => {
    const state = configSlice.reducer(undefined, { type: '@@INIT' })
    expect(state.isInitialized).toBe(false)
  })

  it('setInitialized sets the flag to the payload value', () => {
    const next = configSlice.reducer(
      undefined,
      configAction.setInitialized(true)
    )
    expect(next.isInitialized).toBe(true)

    const back = configSlice.reducer(next, configAction.setInitialized(false))
    expect(back.isInitialized).toBe(false)
  })
})

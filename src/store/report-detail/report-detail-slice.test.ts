import { describe, it, expect } from 'vitest'
import reportDetailSlice from '@/store/report-detail/report-detail-slice'
import type { Data } from '@/types'

const { resetDetail } = reportDetailSlice.actions
const reducer = reportDetailSlice.reducer

const sampleData: Data[] = [
  {
    date: '2026-05-10',
    subdata: [
      { category_id: 'c1', item: [{ id: 'i1', description: 'x', amount: 5 }] },
    ],
  },
]

describe('report-detail slice — detail state', () => {
  it('starts with empty data and not loading', () => {
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state.data).toEqual([])
    expect(state.isLoading).toBe(false)
  })

  it('resetDetail clears data and turns off loading', () => {
    const dirty = {
      ...reducer(undefined, { type: '@@INIT' }),
      data: sampleData,
      isLoading: true,
    }
    const state = reducer(dirty, resetDetail())
    expect(state.data).toEqual([])
    expect(state.isLoading).toBe(false)
  })
})

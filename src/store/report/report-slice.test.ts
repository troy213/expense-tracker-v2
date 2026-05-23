import { describe, it, expect } from 'vitest'
import reportSlice from './report-slice'
import type { Data } from '@/types'

const { resetDetail } = reportSlice.actions
const reducer = reportSlice.reducer

const sampleData: Data[] = [
  {
    date: '2026-05-10',
    subdata: [
      { category_id: 'c1', item: [{ id: 'i1', description: 'x', amount: 5 }] },
    ],
  },
]

describe('report slice — detail state', () => {
  it('starts with empty detailData and detail not loading', () => {
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state.detailData).toEqual([])
    expect(state.isDetailLoading).toBe(false)
  })

  it('resetDetail clears detailData and turns off detail loading', () => {
    const dirty = {
      ...reducer(undefined, { type: '@@INIT' }),
      detailData: sampleData,
      isDetailLoading: true,
    }
    const state = reducer(dirty, resetDetail())
    expect(state.detailData).toEqual([])
    expect(state.isDetailLoading).toBe(false)
  })
})

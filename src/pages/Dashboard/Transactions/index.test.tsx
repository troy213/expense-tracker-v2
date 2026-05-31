import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { configureStore } from '@reduxjs/toolkit'

import { LANGUAGES, LOCALES } from '@/constants'
import categoriesSlice from '@/store/categories/categories-slice'
import transactionsSlice, {
  type InitialState,
} from '@/store/transactions/transactions-slice'
import type { Data } from '@/types'
import Transactions from './'

// Render every item eagerly so the real itemContent (month-header logic) runs.
// react-virtuoso does not virtualize meaningfully under jsdom.
vi.mock('react-virtuoso', () => ({
  Virtuoso: ({
    data,
    itemContent,
    computeItemKey,
  }: {
    data: { date: string }[]
    itemContent: (index: number, item: { date: string }) => JSX.Element
    computeItemKey?: (index: number, item: { date: string }) => string
  }) => (
    <div>
      {data.map((item, index) => (
        <div key={computeItemKey ? computeItemKey(index, item) : index}>
          {itemContent(index, item)}
        </div>
      ))}
    </div>
  ),
}))

// Give Transactions a non-null scrollParent so it renders the list.
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useOutletContext: () => ({ scrollParent: document.createElement('div') }),
  }
})

const renderTransactions = (data: Data[]) => {
  const transactionsReducer: InitialState = {
    isLoading: false,
    data,
  }

  const store = configureStore({
    reducer: {
      categoriesReducer: categoriesSlice.reducer,
      transactionsReducer: transactionsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }),
    preloadedState: { transactionsReducer },
  })

  return render(
    <MemoryRouter>
      <Provider store={store}>
        <IntlProvider
          locale={LOCALES.ENGLISH}
          messages={LANGUAGES[LOCALES.ENGLISH].messages}
        >
          <Transactions />
        </IntlProvider>
      </Provider>
    </MemoryRouter>
  )
}

describe('Transactions month headers', () => {
  it('renders a header at each month boundary, but suppresses the very first group', () => {
    const data: Data[] = [
      { date: '2026-05-23', subdata: [] },
      { date: '2026-05-10', subdata: [] },
      { date: '2026-04-30', subdata: [] },
    ]

    renderTransactions(data)

    // The month-header span has text exactly 'May' / 'April'. The day labels
    // read like '10 May 2026' (month: 'short'), so they don't match an exact
    // 'May'/'April' text query. The first date-group (index 0) never renders a
    // header, so the leading May group has no 'May' header; April still does.
    expect(screen.queryAllByText('May')).toHaveLength(0)
    expect(screen.getAllByText('April')).toHaveLength(1)
  })

  it('renders a header for a later same-month group in a different year (first group still suppressed)', () => {
    const data: Data[] = [
      { date: '2026-05-15', subdata: [] },
      { date: '2025-05-15', subdata: [] },
    ]

    renderTransactions(data)

    // index 0 (2026 May) is suppressed; index 1 (2025 May) is a year-aware
    // boundary, so exactly one 'May' header renders.
    expect(screen.getAllByText('May')).toHaveLength(1)
  })
})

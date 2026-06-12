import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { LANGUAGES, LOCALES } from '@/constants'
import store from '@/store'
import RecurringDetail from '.'

const renderAt = (entry: string) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route
          path="/recurring-detail"
          element={
            <Provider store={store}>
              <IntlProvider
                locale={LOCALES.ENGLISH}
                messages={LANGUAGES[LOCALES.ENGLISH].messages}
              >
                <RecurringDetail />
              </IntlProvider>
            </Provider>
          }
        />
      </Routes>
    </MemoryRouter>
  )

describe('RecurringDetail page', () => {
  it('renders the not-found state when the definition is missing', () => {
    renderAt('/recurring-detail?id=nonexistent')

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(screen.getByText(/recurring not found/i)).toBeInTheDocument()
  })

  it('shows the not-found state when no id is provided', () => {
    renderAt('/recurring-detail')

    expect(screen.getByText(/recurring not found/i)).toBeInTheDocument()
  })
})

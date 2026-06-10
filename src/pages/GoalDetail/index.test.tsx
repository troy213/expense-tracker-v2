import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { LANGUAGES, LOCALES } from '@/constants'
import store from '@/store'
import GoalDetail from '.'

const renderAt = (entry: string) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route
          path="/goal-detail"
          element={
            <Provider store={store}>
              <IntlProvider
                locale={LOCALES.ENGLISH}
                messages={LANGUAGES[LOCALES.ENGLISH].messages}
              >
                <GoalDetail />
              </IntlProvider>
            </Provider>
          }
        />
      </Routes>
    </MemoryRouter>
  )

describe('GoalDetail page', () => {
  it('renders the not-found state with a back button when the goal is missing', () => {
    renderAt('/goal-detail?id=nonexistent')

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(screen.getByText(/goal not found/i)).toBeInTheDocument()
  })

  it('shows the not-found state when no id is provided', () => {
    renderAt('/goal-detail')

    expect(screen.getByText(/goal not found/i)).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { LANGUAGES, LOCALES } from '@/constants'
import store from '@/store'
import GoalDetail from './'

describe('GoalDetail page', () => {
  it('renders the navbar with a back button', () => {
    render(
      <MemoryRouter initialEntries={['/goals/nonexistent']}>
        <Routes>
          <Route
            path="/goals/:id"
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

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { LANGUAGES, LOCALES } from '@/constants'
import store from '@/store'
import Recurring from './'

describe('Recurring page', () => {
  it('renders the title, add button, and empty state', () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <IntlProvider
            locale={LOCALES.ENGLISH}
            messages={LANGUAGES[LOCALES.ENGLISH].messages}
          >
            <Recurring />
          </IntlProvider>
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Recurring')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(screen.getByText('Add Recurring')).toBeInTheDocument()
    expect(
      screen.getByText('No recurring transactions yet.')
    ).toBeInTheDocument()
  })
})

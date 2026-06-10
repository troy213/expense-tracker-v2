import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { LANGUAGES, LOCALES } from '@/constants'
import store from '@/store'
import Goals from './'

describe('Goals page', () => {
  it('renders the title, back button and add-goal button', () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <IntlProvider
            locale={LOCALES.ENGLISH}
            messages={LANGUAGES[LOCALES.ENGLISH].messages}
          >
            <Goals />
          </IntlProvider>
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Goals')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /add goal/i })
    ).toBeInTheDocument()
  })
})

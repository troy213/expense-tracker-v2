import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { LANGUAGES, LOCALES } from '@/constants'
import store from '@/store'
import Reports from './'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useOutletContext: () => ({ scrollParent: null }),
  }
})

describe('Reports Component', () => {
  it('renders the Reports page with the report info section', () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <IntlProvider
            locale={LOCALES.ENGLISH}
            messages={LANGUAGES[LOCALES.ENGLISH].messages}
          >
            <Reports />
          </IntlProvider>
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Total Income')).toBeInTheDocument()
    expect(screen.getByText('Average Spending')).toBeInTheDocument()
  })
})

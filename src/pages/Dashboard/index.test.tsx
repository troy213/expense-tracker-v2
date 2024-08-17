import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'

import { LANGUAGES, LOCALES } from '@/constants'
import Dashboard from './'

describe('Dashboard Component', () => {
  it('renders Dashboard component', () => {
    render(
      <MemoryRouter>
        <IntlProvider
          locale={LOCALES.ENGLISH}
          messages={LANGUAGES[LOCALES.ENGLISH].messages}
        >
          <Dashboard />
        </IntlProvider>
      </MemoryRouter>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})

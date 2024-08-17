import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'

import { english, indonesia } from '@/locales'
import Dashboard from './'

const locales = {
  'id-ID': indonesia,
  'en-US': english,
}
const language = 'en-US'

describe('Dashboard Component', () => {
  it('renders Dashboard component', () => {
    render(
      <MemoryRouter>
        <IntlProvider locale={language} messages={locales[language].messages}>
          <Dashboard />
        </IntlProvider>
      </MemoryRouter>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})

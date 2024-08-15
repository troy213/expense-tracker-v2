import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from './'
import { IntlProvider } from 'react-intl'
import english from '../../locales/en-US'
import indo from '../../locales/id-Id'

const locales = {
  'id-ID': indo,
  'en-US': english,
}
const language = 'en-US'

describe('Dashboard Component', () => {
  it('renders the Dashboard component on the root path', () => {
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

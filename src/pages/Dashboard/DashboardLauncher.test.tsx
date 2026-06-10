import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'

import { LANGUAGES, LOCALES } from '@/constants'
import DashboardLauncher from './DashboardLauncher'

const renderLauncher = () =>
  render(
    <MemoryRouter>
      <IntlProvider
        locale={LOCALES.ENGLISH}
        messages={LANGUAGES[LOCALES.ENGLISH].messages}
      >
        <DashboardLauncher />
      </IntlProvider>
    </MemoryRouter>
  )

describe('DashboardLauncher', () => {
  it('links to the Goals, Recurring, and Loans pages', () => {
    renderLauncher()

    expect(screen.getByRole('link', { name: /goals/i })).toHaveAttribute(
      'href',
      '/goals'
    )
    expect(screen.getByRole('link', { name: /recurring/i })).toHaveAttribute(
      'href',
      '/recurring'
    )
    expect(screen.getByRole('link', { name: /loans/i })).toHaveAttribute(
      'href',
      '/loans'
    )
  })
})

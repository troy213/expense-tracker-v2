import { describe, it, expect, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { LANGUAGES, LOCALES } from '@/constants'
import store from '@/store'
import { recurringAction } from '@/store/recurring/recurring-slice'
import { RecurringHistoryEntry } from '@/types'
import DashboardLauncher from './DashboardLauncher'

const row = (
  period: string,
  status: RecurringHistoryEntry['status']
): RecurringHistoryEntry => ({
  id: `r1:${period}`,
  recurring_id: 'r1',
  date: `${period}-15`,
  category_id: 'c1',
  transaction_name: 'Netflix',
  amount: 186_000,
  status,
})

const renderLauncher = () =>
  render(
    <MemoryRouter>
      <Provider store={store}>
        <IntlProvider
          locale={LOCALES.ENGLISH}
          messages={LANGUAGES[LOCALES.ENGLISH].messages}
        >
          <DashboardLauncher />
        </IntlProvider>
      </Provider>
    </MemoryRouter>
  )

afterEach(() => {
  store.dispatch(recurringAction.resetState())
})

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

  it('shows no badge when nothing is pending', () => {
    renderLauncher()
    expect(screen.queryByTestId('recurring-badge')).not.toBeInTheDocument()
  })

  it('shows the pending count on the Recurring tile', () => {
    store.dispatch(
      recurringAction.setState({
        state: 'history',
        value: [
          row('2026-05', 'pending'),
          row('2026-06', 'pending'),
          row('2026-04', 'added'),
        ],
      })
    )
    renderLauncher()

    expect(screen.getByTestId('recurring-badge')).toHaveTextContent('2')
  })
})

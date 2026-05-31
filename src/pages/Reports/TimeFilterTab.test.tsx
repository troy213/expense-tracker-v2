import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { TIME_FILTER, LANGUAGES, LOCALES } from '@/constants'
import store from '@/store'
import TimeFilterTab from './TimeFilterTab'

const renderTab = (timeFilter: number) =>
  render(
    <MemoryRouter>
      <Provider store={store}>
        <IntlProvider
          locale={LOCALES.ENGLISH}
          messages={LANGUAGES[LOCALES.ENGLISH].messages}
        >
          <TimeFilterTab
            dateFrom={null}
            dateTo={null}
            timeFilter={timeFilter}
          />
        </IntlProvider>
      </Provider>
    </MemoryRouter>
  )

const openMenu = () =>
  fireEvent.click(screen.getByRole('button', { name: 'More options' }))

describe('TimeFilterTab — dynamic second tab', () => {
  beforeEach(() => {
    const portal = document.createElement('div')
    portal.setAttribute('id', 'portal')
    document.body.appendChild(portal)
  })

  afterEach(() => {
    document.getElementById('portal')?.remove()
  })

  it('defaults to All + This Month tabs with All selected and the rest in the menu', () => {
    renderTab(TIME_FILTER.ALL_TIME)

    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('tab', { name: 'This Month' })).toHaveAttribute(
      'aria-selected',
      'false'
    )

    openMenu()
    expect(
      screen.getByRole('button', { name: 'Last Month' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'This Year' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Custom Filter' })
    ).toBeInTheDocument()
    // This Month is the dynamic tab, so it must NOT appear in the menu.
    expect(screen.queryByRole('button', { name: 'This Month' })).toBeNull()
  })

  it('promotes the selected range into the second tab and drops This Month into the menu', () => {
    renderTab(TIME_FILTER.THIS_YEAR)

    expect(screen.getByRole('tab', { name: 'This Year' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute(
      'aria-selected',
      'false'
    )
    // This Year now occupies the tab, so it is no longer a menu item.
    expect(screen.queryByRole('tab', { name: 'This Month' })).toBeNull()

    openMenu()
    expect(
      screen.getByRole('button', { name: 'This Month' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Last Month' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Custom Filter' })
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'This Year' })).toBeNull()
  })

  it('reopens the date modal when the Custom Filter tab is clicked', () => {
    renderTab(TIME_FILTER.CUSTOM_FILTER)

    const customTab = screen.getByRole('tab', { name: 'Custom Filter' })
    expect(customTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByText('From')).toBeNull()

    fireEvent.click(customTab)

    expect(screen.getByText('From')).toBeInTheDocument()
  })

  it('closes the menu when the trigger is clicked again while open', () => {
    renderTab(TIME_FILTER.ALL_TIME)
    const trigger = screen.getByRole('button', { name: 'More options' })

    fireEvent.click(trigger)
    expect(
      screen.getByRole('button', { name: 'This Year' })
    ).toBeInTheDocument()

    // A real pointer click is mousedown then click. The mousedown must not also
    // trigger click-outside-to-close, or close() + toggle() cancel out and the
    // menu stays open.
    fireEvent.mouseDown(trigger)
    fireEvent.click(trigger)

    expect(screen.queryByRole('button', { name: 'This Year' })).toBeNull()
  })
})

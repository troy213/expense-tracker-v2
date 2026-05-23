import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import { LANGUAGES, LOCALES } from '@/constants'
import ReportWidget from './'
import type { ReportCategory } from '@/types'

const navigateMock = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => navigateMock }
})

const renderWidget = (report: ReportCategory[]) =>
  render(
    <MemoryRouter>
      <IntlProvider
        locale={LOCALES.ENGLISH}
        messages={LANGUAGES[LOCALES.ENGLISH].messages}
      >
        <ReportWidget
          type="expense"
          report={report}
          typeTotal={1000}
          dateFrom="2026-05-01"
          dateTo="2026-05-31"
        />
      </IntlProvider>
    </MemoryRouter>
  )

const sampleCat: ReportCategory = {
  id: 'cat-1',
  type: 'expense',
  name: 'Food',
  icon_id: 'food',
  color: '#000',
  total: 1000,
}

describe('ReportWidget navigation', () => {
  it('navigates to the detail page by type when the header is clicked', () => {
    navigateMock.mockClear()
    renderWidget([sampleCat])
    fireEvent.click(screen.getByText('Top Expense'))
    expect(navigateMock).toHaveBeenCalledWith(
      '/report-detail?type=expense&date_from=2026-05-01&date_to=2026-05-31'
    )
  })

  it('navigates to the detail page by category when a category is clicked', () => {
    navigateMock.mockClear()
    renderWidget([sampleCat])
    fireEvent.click(screen.getByText('Food'))
    expect(navigateMock).toHaveBeenCalledWith(
      '/report-detail?category_id=cat-1&date_from=2026-05-01&date_to=2026-05-31'
    )
  })
})

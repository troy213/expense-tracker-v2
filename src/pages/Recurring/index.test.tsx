import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'

import { LANGUAGES, LOCALES } from '@/constants'
import Recurring from './'

describe('Recurring page', () => {
  it('renders the title and a back button', () => {
    render(
      <MemoryRouter>
        <IntlProvider
          locale={LOCALES.ENGLISH}
          messages={LANGUAGES[LOCALES.ENGLISH].messages}
        >
          <Recurring />
        </IntlProvider>
      </MemoryRouter>
    )

    expect(screen.getByText('Recurring')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })
})

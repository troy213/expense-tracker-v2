import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'

import { LOCALES, LANGUAGES } from '@/constants'
import mainSlice, { mainAction } from '@/store/main/main-slice'
import Languages from '.'

describe('Theme', () => {
  it('Renders Language', () => {
    const mockStore = configureStore({
      reducer: {
        mainReducer: mainSlice.reducer,
      },
    })
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <IntlProvider
            locale={LOCALES.ENGLISH}
            messages={LANGUAGES[LOCALES.ENGLISH].messages}
          >
            <Languages />
          </IntlProvider>
        </MemoryRouter>
      </Provider>
    )

    const navbar = screen.getByText('Language')
    const eng = screen.getByText('English')
    const ind = screen.getByText('Indonesia')
    expect(navbar).toBeInTheDocument()
    expect(eng).toBeInTheDocument()
    expect(ind).toBeInTheDocument()
  })

  it('Switches to Indonesian Language when clicked', () => {
    const mockStore = configureStore({
      reducer: {
        mainReducer: mainSlice.reducer,
      },
    })
    const mockDispatch = vi.spyOn(mockStore, 'dispatch')

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <IntlProvider
            locale={LOCALES.ENGLISH}
            messages={LANGUAGES[LOCALES.ENGLISH].messages}
          >
            <Languages />
          </IntlProvider>
        </MemoryRouter>
      </Provider>
    )

    const ind = screen.getByText('Indonesia')
    fireEvent.click(ind)
    expect(mockDispatch).toBeCalledWith(
      mainAction.setState({ state: 'selectedLocale', value: LOCALES.INDONESIA })
    )
  })
})

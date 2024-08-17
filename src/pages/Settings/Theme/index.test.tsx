import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'

import { LANGUAGES, LOCALES } from '@/constants'
import mainSlice, { mainAction } from '@/store/main/main-slice'
import Theme from '.'

describe('Theme', () => {
  it('Renders Theme', () => {
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
            <Theme />
          </IntlProvider>
        </MemoryRouter>
      </Provider>
    )
    const navbar = screen.getByText('Theme')
    expect(navbar).toBeInTheDocument()
    const lightRadio = screen.getByLabelText(/light theme/i)
    expect(lightRadio).toBeChecked()
    const darkRadio = screen.getByLabelText(/dark theme/i)
    expect(darkRadio).not.toBeChecked()
  })

  it('Switches to dark theme', () => {
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
            <Theme />
          </IntlProvider>
        </MemoryRouter>
      </Provider>
    )

    const lightRadio = screen.getByLabelText(/light theme/i)
    const darkRadio = screen.getByLabelText(/dark theme/i)
    fireEvent.click(darkRadio)
    expect(darkRadio).toBeChecked()
    expect(lightRadio).not.toBeChecked()
    expect(mockDispatch).toBeCalledWith(
      mainAction.setState({ state: 'theme', value: 'dark' })
    )
  })
})

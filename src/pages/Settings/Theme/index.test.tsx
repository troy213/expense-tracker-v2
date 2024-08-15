import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import mainSlice, { mainAction } from '@/store/main/main-slice'
import Theme from '.'
import { IntlProvider } from 'react-intl'
import english from '../../../locales/en-US'
import indo from '../../../locales/id-Id'

const locales = {
  'id-ID': indo,
  'en-US': english,
}
const language = 'en-US'

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
          <IntlProvider locale={language} messages={locales[language].messages}>
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
          <IntlProvider locale={language} messages={locales[language].messages}>
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

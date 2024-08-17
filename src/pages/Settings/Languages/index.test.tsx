import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import mainSlice, { mainAction } from '@/store/main/main-slice'
import { IntlProvider } from 'react-intl'
import english from '../../../locales/en-US'
import indo from '../../../locales/id-Id'
import Languages from '.'

const locales = {
  'id-ID': indo,
  'en-US': english,
}
const language = 'en-US'

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
          <IntlProvider locale={language} messages={locales[language].messages}>
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
          <IntlProvider locale={language} messages={locales[language].messages}>
            <Languages />
          </IntlProvider>
        </MemoryRouter>
      </Provider>
    )

    const ind = screen.getByText('Indonesia')
    fireEvent.click(ind)
    expect(mockDispatch).toBeCalledWith(
      mainAction.setState({ state: 'lang', value: 'id-ID' })
    )
  })
})

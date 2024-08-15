import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import store from './store'
import english from './locales/en-US'
import indo from './locales/id-Id'
import { IntlProvider } from 'react-intl'

const locales = {
  'id-ID': indo,
  'en-US': english,
}
const language = 'en-US'

describe('App Component routing test', () => {
  it('renders the Dashboard component on the root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Provider store={store}>
          <IntlProvider locale={language} messages={locales[language].messages}>
            <App />
          </IntlProvider>
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders the Categories component on /categories path', () => {
    render(
      <MemoryRouter initialEntries={['/categories']}>
        <Provider store={store}>
          <IntlProvider locale={language} messages={locales[language].messages}>
            <App />
          </IntlProvider>
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Category & Budget')).toBeInTheDocument()
  })

  it('renders the Reports component on /reports path', () => {
    render(
      <MemoryRouter initialEntries={['/reports']}>
        <Provider store={store}>
          <IntlProvider locale={language} messages={locales[language].messages}>
            <App />
          </IntlProvider>
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Reports')).toBeInTheDocument()
  })

  it('renders the Settings component on /settings path', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Provider store={store}>
          <IntlProvider locale={language} messages={locales[language].messages}>
            <App />
          </IntlProvider>
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('renders the Theme component on /settings/theme path', () => {
    render(
      <MemoryRouter initialEntries={['/settings/theme']}>
        <Provider store={store}>
          <IntlProvider locale={language} messages={locales[language].messages}>
            <App />
          </IntlProvider>
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Theme')).toBeInTheDocument()
  })

  it('renders the Languages component on /settings/language path', () => {
    render(
      <MemoryRouter initialEntries={['/settings/language']}>
        <Provider store={store}>
          <IntlProvider locale={language} messages={locales[language].messages}>
            <App />
          </IntlProvider>
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Language')).toBeInTheDocument()
  })

  it('renders the NotFound component on an unknown path', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-path']}>
        <Provider store={store}>
          <IntlProvider locale={language} messages={locales[language].messages}>
            <App />
          </IntlProvider>
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('404 Not Found')).toBeInTheDocument()
  })
})

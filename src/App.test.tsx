import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import store from '@/store'
import App from './App'

describe('App Component routing test', () => {
  it('renders the Dashboard component on the root path', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
  })

  it('renders the Categories component on /categories path', async () => {
    render(
      <MemoryRouter initialEntries={['/categories']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    expect(await screen.findByText('Category & Budget')).toBeInTheDocument()
  })

  it('renders the Reports component on /reports path', async () => {
    render(
      <MemoryRouter initialEntries={['/reports']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    expect(await screen.findByText('Reports')).toBeInTheDocument()
  })

  it('renders the Report Detail component on /report-detail path', async () => {
    render(
      <MemoryRouter initialEntries={['/report-detail?type=expense']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    // ReportDetail swaps its Navbar between the loading and loaded render trees,
    // so re-query the live DOM (waitFor + getByText) rather than holding a node
    // that may unmount mid-flight (findByText).
    await waitFor(() => expect(screen.getByText('Reports')).toBeInTheDocument())
  })

  it('renders the Settings component on /settings path', async () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    expect(await screen.findByText('Settings')).toBeInTheDocument()
  })

  it('renders the Theme component on /settings/theme path', async () => {
    render(
      <MemoryRouter initialEntries={['/settings/theme']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    expect(await screen.findByText('Theme')).toBeInTheDocument()
  })

  it('renders the Languages component on /settings/language path', async () => {
    render(
      <MemoryRouter initialEntries={['/settings/language']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    expect(await screen.findByText('Language')).toBeInTheDocument()
  })

  it('renders the NotFound component on an unknown path', async () => {
    render(
      <MemoryRouter initialEntries={['/unknown-path']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    expect(await screen.findByText('Page Not Found')).toBeInTheDocument()
  })
})

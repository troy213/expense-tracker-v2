import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import store from '@/store'
import App from './App'

describe('App Component routing test', () => {
  it('renders the Dashboard component on the root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders the Categories component on /categories path', () => {
    render(
      <MemoryRouter initialEntries={['/categories']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Category & Budget')).toBeInTheDocument()
  })

  it('renders the Reports component on /reports path', () => {
    render(
      <MemoryRouter initialEntries={['/reports']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Reports')).toBeInTheDocument()
  })

  it('renders the Settings component on /settings path', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('renders the Theme component on /settings/theme path', () => {
    render(
      <MemoryRouter initialEntries={['/settings/theme']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Theme')).toBeInTheDocument()
  })

  it('renders the Languages component on /settings/language path', () => {
    render(
      <MemoryRouter initialEntries={['/settings/language']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Language')).toBeInTheDocument()
  })

  it('renders the NotFound component on an unknown path', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-path']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('404 Not Found')).toBeInTheDocument()
  })
})

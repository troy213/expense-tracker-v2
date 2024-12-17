import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Toolbar from '@/components/Toolbar'
import store from '@/store'

// Mocking the SVGs for simplicity
vi.mock('@/assets', () => ({
  BudgetSvg: () => <svg data-testid="budget-icon" />,
  HomeSvg: () => <svg data-testid="home-icon" />,
  PieChartSvg: () => <svg data-testid="piechart-icon" />,
  PlusSvg: () => <svg data-testid="plus-icon" />,
  SettingsSvg: () => <svg data-testid="settings-icon" />,
}))

describe('Toolbar Component', () => {
  test('renders all toolbar icons and links', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Toolbar />
        </Provider>
      </BrowserRouter>
    )

    // Check if all icons are rendered
    expect(screen.getByTestId('home-icon')).toBeInTheDocument()
    expect(screen.getByTestId('piechart-icon')).toBeInTheDocument()
    expect(screen.getByTestId('budget-icon')).toBeInTheDocument()
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument()
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument()

    // Check if the correct links are rendered
    expect(screen.getAllByRole('link')[0]).toHaveAttribute('href', '/')
    expect(screen.getAllByRole('link')[1]).toHaveAttribute('href', '/reports')
    expect(screen.getAllByRole('link')[2]).toHaveAttribute(
      'href',
      '/categories'
    )
    expect(screen.getAllByRole('link')[3]).toHaveAttribute('href', '/settings')
  })

  // test('add button triggers the modal action when clicked', () => {
  //   const mockModalHandler = vi.fn()

  //   render(
  //     <BrowserRouter>
  //       <Toolbar />
  //     </BrowserRouter>
  //   )

  //   // Simulate clicking the add button
  //   const addButton = screen.getByRole('button')
  //   fireEvent.click(addButton)

  //   // Assert that the modal handler is triggered
  //   expect(mockModalHandler).toHaveBeenCalled()
  // })
})

import '@testing-library/jest-dom'
import { vi } from 'vitest'

// jsdom does not implement matchMedia; usePWAInstall relies on it.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

// Mock the database service to avoid IndexedDB issues in tests
vi.mock('@/lib/db', () => ({
  default: {
    initializeDB: vi.fn().mockResolvedValue({}),
    closeDB: vi.fn().mockResolvedValue(undefined),
    clearAllData: vi.fn().mockResolvedValue(undefined),
    allData: vi.fn().mockResolvedValue({
      categories: [],
      transactions: [],
    }),
    importData: vi.fn().mockResolvedValue(undefined),
    categories: {
      getAllCategories: vi.fn().mockResolvedValue([]),
      getCategoriesByIndex: vi.fn().mockResolvedValue([]),
      getCategoriesByType: vi.fn().mockResolvedValue([]),
      getCategoryById: vi.fn().mockResolvedValue(undefined),
      putCategory: vi.fn().mockResolvedValue(''),
      putCategories: vi.fn().mockResolvedValue(undefined),
      deleteCategory: vi.fn().mockResolvedValue(null),
      hardDeleteCategory: vi.fn().mockResolvedValue(undefined),
      clearCategories: vi.fn().mockResolvedValue(undefined),
    },
    transactions: {
      getAllTransactions: vi.fn().mockResolvedValue([]),
      getTransactionsByDateRange: vi.fn().mockResolvedValue([]),
      getTransactionsByCategory: vi.fn().mockResolvedValue([]),
      getTransactionsByCategoryAndDateRange: vi.fn().mockResolvedValue([]),
      getTransactionsByDescription: vi.fn().mockResolvedValue([]),
      getTransactionsWithPagination: vi.fn().mockResolvedValue({
        transactions: [],
        total: 0,
      }),
      getTransactionById: vi.fn().mockResolvedValue(undefined),
      putTransaction: vi.fn().mockResolvedValue(''),
      putTransactions: vi.fn().mockResolvedValue(undefined),
      deleteTransaction: vi.fn().mockResolvedValue(undefined),
      deleteTransactions: vi.fn().mockResolvedValue(undefined),
      clearTransactions: vi.fn().mockResolvedValue(undefined),
    },
  },
}))

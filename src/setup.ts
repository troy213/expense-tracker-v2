import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock the database service to avoid IndexedDB issues in tests
vi.mock('@/lib/db', () => ({
  default: {
    initializeDB: vi.fn().mockResolvedValue({}),
    getDB: vi.fn().mockResolvedValue({}),
    getAllCategories: vi.fn().mockResolvedValue([]),
    getAllTransactions: vi.fn().mockResolvedValue([]),
    getCategoriesByType: vi.fn().mockResolvedValue([]),
    getCategoryById: vi.fn().mockResolvedValue(undefined),
    getTransactionById: vi.fn().mockResolvedValue(undefined),
    getTransactionsByCategory: vi.fn().mockResolvedValue([]),
    getTransactionsByDateRange: vi.fn().mockResolvedValue([]),
    getTransactionsByDescription: vi.fn().mockResolvedValue([]),
    getTransactionsWithPagination: vi.fn().mockResolvedValue({
      transactions: [],
      total: 0,
    }),
    putCategory: vi.fn().mockResolvedValue(''),
    putTransaction: vi.fn().mockResolvedValue(''),
    putTransactions: vi.fn().mockResolvedValue(undefined),
    deleteCategory: vi.fn().mockResolvedValue(undefined),
    deleteTransaction: vi.fn().mockResolvedValue(undefined),
    deleteTransactions: vi.fn().mockResolvedValue(undefined),
    clearCategories: vi.fn().mockResolvedValue(undefined),
    clearTransactions: vi.fn().mockResolvedValue(undefined),
    clearAllData: vi.fn().mockResolvedValue(undefined),
    llData: vi.fn().mockResolvedValue({
      categories: [],
      transactions: [],
    }),
    importData: vi.fn().mockResolvedValue(undefined),
    closeDB: vi.fn().mockResolvedValue(undefined),
  },
}))

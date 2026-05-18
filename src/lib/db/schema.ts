import { DBSchema } from 'idb'
import { Category, CategoryType, Transaction } from '@/types'

// IndexedDB Schema
export interface ExpenseTrackerDB extends DBSchema {
  categories: {
    key: string
    value: Category
    indexes: { 'by-type': CategoryType }
  }
  transactions: {
    key: string
    value: Transaction
    indexes: {
      'by-date': string
      'by-category': string
      'by-description': string
    }
  }
}

export const DB_NAME = 'expense-tracker'
export const DB_VERSION = 1

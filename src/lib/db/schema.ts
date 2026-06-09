import { DBSchema } from 'idb'
import {
  Category,
  CategoryType,
  Goal,
  GoalHistoryEntry,
  GoalStatus,
  Transaction,
} from '@/types'

// IndexedDB Schema
export interface ExpenseTrackerDB extends DBSchema {
  categories: {
    key: string
    value: Category
    indexes: {
      'by-type': CategoryType
      'by-index': number
    }
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
  goals: {
    key: string
    value: Goal
    indexes: {
      'by-status': GoalStatus
    }
  }
  goal_history: {
    key: string
    value: GoalHistoryEntry
    indexes: {
      'by-goal': string
    }
  }
}

export const DB_NAME = 'expense-tracker'
export const DB_VERSION = 3

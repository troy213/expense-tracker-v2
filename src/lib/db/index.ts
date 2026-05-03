import { DBSchema, IDBPDatabase, openDB } from 'idb'
import { Category, CategoryType, Transaction } from '@/types'

// IndexedDB Schema
interface ExpenseTrackerDB extends DBSchema {
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

const DB_NAME = 'expense-tracker'
const DB_VERSION = 1

let db: IDBPDatabase<ExpenseTrackerDB> | null = null

/**
 * Initialize the IndexedDB database
 * This should be called once when the app starts
 */
async function initializeDB(): Promise<IDBPDatabase<ExpenseTrackerDB>> {
  if (db) return db

  db = await openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create categories store
      if (!db.objectStoreNames.contains('categories')) {
        const categoryStore = db.createObjectStore('categories', {
          keyPath: 'id',
        })
        categoryStore.createIndex('by-type', 'type')
      }

      // Create transactions store
      if (!db.objectStoreNames.contains('transactions')) {
        const txStore = db.createObjectStore('transactions', { keyPath: 'id' })
        txStore.createIndex('by-date', 'date')
        txStore.createIndex('by-category', 'category_id')
        txStore.createIndex('by-description', 'description')
      }
    },
  })

  return db
}

/**
 * Get the database instance
 */
async function getDB(): Promise<IDBPDatabase<ExpenseTrackerDB>> {
  if (!db) {
    return initializeDB()
  }
  return db
}

// ============================================================================
// CATEGORY OPERATIONS
// ============================================================================

/**
 * Get all categories
 */
async function getAllCategories(): Promise<Category[]> {
  const database = await getDB()
  return database.getAll('categories')
}

/**
 * Get categories by type (income or expense)
 */
async function getCategoriesByType(type: CategoryType): Promise<Category[]> {
  const database = await getDB()
  return database.getAllFromIndex('categories', 'by-type', type)
}

/**
 * Get a single category by ID
 */
async function getCategoryById(id: string): Promise<Category | undefined> {
  const database = await getDB()
  return database.get('categories', id)
}

/**
 * Add or update a category
 */
async function putCategory(category: Category): Promise<string> {
  const database = await getDB()
  return database.put('categories', category)
}

/**
 * Add multiple categories at once
 */
async function putCategories(categories: Category[]): Promise<void> {
  const database = await getDB()
  const tx = database.transaction('categories', 'readwrite')

  for (const category of categories) {
    tx.store.put(category)
  }

  await tx.done
}

/**
 * Delete a category by ID
 */
async function deleteCategory(id: string): Promise<void> {
  const database = await getDB()
  await database.delete('categories', id)
}

/**
 * Clear all categories
 */
async function clearCategories(): Promise<void> {
  const database = await getDB()
  await database.clear('categories')
}

// ============================================================================
// TRANSACTION OPERATIONS
// ============================================================================

/**
 * Get all transactions
 */
async function getAllTransactions(): Promise<Transaction[]> {
  const database = await getDB()
  return database.getAll('transactions')
}

/**
 * Get transactions by date range (inclusive)
 * @param startDate - ISO string date (e.g., '2024-01-01')
 * @param endDate - ISO string date (e.g., '2024-01-31')
 */
async function getTransactionsByDateRange(
  startDate: string,
  endDate: string
): Promise<Transaction[]> {
  const database = await getDB()
  const allTx = await database.getAllFromIndex('transactions', 'by-date')

  // Filter by date range since IDBKeyRange doesn't work well with string dates
  return allTx.filter((tx) => {
    const txDate = new Date(tx.date).getTime()
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    return txDate >= start && txDate <= end
  })
}

/**
 * Get transactions by category ID
 */
async function getTransactionsByCategory(
  categoryId: string
): Promise<Transaction[]> {
  const database = await getDB()
  return database.getAllFromIndex('transactions', 'by-category', categoryId)
}

/**
 * Get transactions by description (case-insensitive substring match)
 * Similar to SQL LIKE '%value%'
 */
async function getTransactionsByDescription(
  searchTerm: string
): Promise<Transaction[]> {
  const database = await getDB()
  const allTx = await database.getAll('transactions')
  const lowerSearchTerm = searchTerm.toLowerCase()

  return allTx.filter((tx) =>
    tx.description.toLowerCase().includes(lowerSearchTerm)
  )
}

/**
 * Get transactions with pagination support
 * @param limit - Number of items per page
 * @param offset - Number of items to skip
 */
async function getTransactionsWithPagination(
  limit: number,
  offset: number = 0
): Promise<{ transactions: Transaction[]; total: number }> {
  const database = await getDB()
  const allTx = await database.getAll('transactions')
  const total = allTx.length

  // Sort by date descending (most recent first)
  const sorted = allTx.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const transactions = sorted.slice(offset, offset + limit)

  return {
    transactions,
    total,
  }
}

/**
 * Get a single transaction by ID
 */
async function getTransactionById(
  id: string
): Promise<Transaction | undefined> {
  const database = await getDB()
  return database.get('transactions', id)
}

/**
 * Add or update a transaction
 */
async function putTransaction(transaction: Transaction): Promise<string> {
  const database = await getDB()
  return database.put('transactions', transaction)
}

/**
 * Add multiple transactions at once
 */
async function putTransactions(transactions: Transaction[]): Promise<void> {
  const database = await getDB()
  const tx = database.transaction('transactions', 'readwrite')

  for (const transaction of transactions) {
    tx.store.put(transaction)
  }

  await tx.done
}

/**
 * Delete a transaction by ID
 */
async function deleteTransaction(id: string): Promise<void> {
  const database = await getDB()
  await database.delete('transactions', id)
}

/**
 * Delete multiple transactions
 */
async function deleteTransactions(ids: string[]): Promise<void> {
  const database = await getDB()
  const tx = database.transaction('transactions', 'readwrite')

  for (const id of ids) {
    tx.store.delete(id)
  }

  await tx.done
}

/**
 * Clear all transactions
 */
async function clearTransactions(): Promise<void> {
  const database = await getDB()
  await database.clear('transactions')
}

// ============================================================================
// UTILITY OPERATIONS
// ============================================================================

/**
 * Clear all data from both stores
 */
async function clearAllData(): Promise<void> {
  const database = await getDB()
  await database.clear('categories')
  await database.clear('transactions')
}

/**
 * all data for backup
 */
async function allData(): Promise<{
  categories: Category[]
  transactions: Transaction[]
}> {
  const database = await getDB()
  return {
    categories: await database.getAll('categories'),
    transactions: await database.getAll('transactions'),
  }
}

/**
 * Import data from backup
 */
async function importData(data: {
  categories: Category[]
  transactions: Transaction[]
}): Promise<void> {
  const database = await getDB()

  // Clear existing data
  await database.clear('categories')
  await database.clear('transactions')

  const tx = database.transaction(['categories', 'transactions'], 'readwrite')

  // Import categories
  for (const category of data.categories) {
    await tx.objectStore('categories').put(category)
  }

  // Import transactions
  for (const transaction of data.transactions) {
    await tx.objectStore('transactions').put(transaction)
  }

  await tx.done
}

/**
 * Close the database connection
 */
async function closeDB(): Promise<void> {
  if (db) {
    db.close()
    db = null
  }
}

const dbServices = {
  allData,
  clearAllData,
  clearCategories,
  clearTransactions,
  closeDB,
  deleteCategory,
  deleteTransaction,
  deleteTransactions,
  getAllCategories,
  getAllTransactions,
  getCategoriesByType,
  getCategoryById,
  getTransactionById,
  getTransactionsByCategory,
  getTransactionsByDateRange,
  getTransactionsByDescription,
  getTransactionsWithPagination,
  importData,
  initializeDB,
  putCategory,
  putCategories,
  putTransaction,
  putTransactions,
}

export default dbServices

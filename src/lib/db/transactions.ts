import { Transaction } from '@/types'
import { getDB } from './connection'

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
 * Get transactions for a single category within a date range (inclusive).
 *
 * Uses the `by-category` index so only one category's transactions are read
 * from disk, then filters that (small) set by date in memory. Dates are
 * zero-padded 'YYYY-MM-DD' strings, so lexicographic comparison is correct.
 */
async function getTransactionsByCategoryAndDateRange(
  categoryId: string,
  startDate: string,
  endDate: string
): Promise<Transaction[]> {
  const database = await getDB()
  const categoryTx = await database.getAllFromIndex(
    'transactions',
    'by-category',
    categoryId
  )

  return categoryTx.filter((tx) => tx.date >= startDate && tx.date <= endDate)
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

const transactionServices = {
  getAllTransactions,
  getTransactionsByDateRange,
  getTransactionsByCategory,
  getTransactionsByCategoryAndDateRange,
  getTransactionsByDescription,
  getTransactionsWithPagination,
  getTransactionById,
  putTransaction,
  putTransactions,
  deleteTransaction,
  deleteTransactions,
  clearTransactions,
}

export default transactionServices

import { Category, Transaction } from '@/types'
import { closeDB, getDB, initializeDB } from './connection'
import categoryServices from './categories'
import goalsServices from './goals'
import reportServices from './report'
import transactionServices from './transactions'

// ============================================================================
// UTILITY OPERATIONS (cross-store)
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

const dbServices = {
  // Main database functionality
  initializeDB,
  closeDB,
  allData,
  clearAllData,
  importData,

  // Namespaced operations
  categories: categoryServices,
  goals: goalsServices,
  report: reportServices,
  transactions: transactionServices,
}

export default dbServices

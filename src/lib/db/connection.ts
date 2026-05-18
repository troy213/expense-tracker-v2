import { IDBPDatabase, openDB } from 'idb'
import { DB_NAME, DB_VERSION, ExpenseTrackerDB } from './schema'

let db: IDBPDatabase<ExpenseTrackerDB> | null = null

/**
 * Initialize the IndexedDB database
 * This should be called once when the app starts
 */
export async function initializeDB(): Promise<IDBPDatabase<ExpenseTrackerDB>> {
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
export async function getDB(): Promise<IDBPDatabase<ExpenseTrackerDB>> {
  if (!db) {
    return initializeDB()
  }
  return db
}

/**
 * Close the database connection
 */
export async function closeDB(): Promise<void> {
  if (db) {
    db.close()
    db = null
  }
}

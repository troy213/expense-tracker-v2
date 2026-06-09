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
    async upgrade(db, oldVersion, _newVersion, transaction) {
      // Create categories store (fresh installs get the full schema here)
      if (!db.objectStoreNames.contains('categories')) {
        const categoryStore = db.createObjectStore('categories', {
          keyPath: 'id',
        })
        categoryStore.createIndex('by-type', 'type')
        categoryStore.createIndex('by-index', 'index')
      }

      // Create transactions store
      if (!db.objectStoreNames.contains('transactions')) {
        const txStore = db.createObjectStore('transactions', { keyPath: 'id' })
        txStore.createIndex('by-date', 'date')
        txStore.createIndex('by-category', 'category_id')
        txStore.createIndex('by-description', 'description')
      }

      // Create goals store (v3). The contains-guard covers both fresh installs
      // and existing installs upgrading from v1/v2 — a brand-new store needs no
      // separate oldVersion branch (that's only for adding indexes to an
      // existing store, as the v2 categories migration below does).
      if (!db.objectStoreNames.contains('goals')) {
        const goalStore = db.createObjectStore('goals', { keyPath: 'id' })
        goalStore.createIndex('by-status', 'status')
      }

      // Create goal_history store (v3): the per-goal money log.
      if (!db.objectStoreNames.contains('goal_history')) {
        const historyStore = db.createObjectStore('goal_history', {
          keyPath: 'id',
        })
        historyStore.createIndex('by-goal', 'goal_id')
      }

      // v2: add the by-index index to existing installs and backfill any
      // legacy categories that predate the `index` field, so they aren't
      // dropped from the (sparse) by-index index.
      if (oldVersion > 0 && oldVersion < 2) {
        const store = transaction.objectStore('categories')
        store.createIndex('by-index', 'index')

        let cursor = await store.openCursor()
        let fallbackIndex = 0
        while (cursor) {
          const category = cursor.value
          if ((category as { index?: number }).index === undefined) {
            await cursor.update({
              ...category,
              index: fallbackIndex,
              is_active: true,
            })
          }
          fallbackIndex += 1
          cursor = await cursor.continue()
        }
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

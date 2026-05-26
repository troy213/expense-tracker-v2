import { Category, CategoryType } from '@/types'
import { getDB } from './connection'

/**
 * Get all categories
 */
async function getAllCategories(): Promise<Category[]> {
  const database = await getDB()
  return database.getAll('categories')
}

/**
 * Get categories by index
 */
async function getCategoriesByIndex(): Promise<Category[]> {
  const database = await getDB()
  return database.getAllFromIndex('categories', 'by-index')
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
 * Delete a category. Hard-deletes if no transactions reference it; otherwise
 * soft-deletes (is_active: false) and mutes the color so archived categories
 * read as inactive in historical views.
 *
 * Returns the updated category when soft-deleted, or `null` when hard-deleted
 * (or when the id didn't exist). Callers can use this to mirror the change
 * into Redux without an extra DB read.
 */
async function deleteCategory(id: string): Promise<Category | null> {
  const database = await getDB()
  const category = await database.get('categories', id)

  if (!category) return null

  const transactions = await database.getAllFromIndex(
    'transactions',
    'by-category',
    id
  )

  if (transactions.length === 0) {
    await database.delete('categories', id)
    return null
  }

  const updated: Category = {
    ...category,
    is_active: false,
    color: '#9ca3af',
  }
  await database.put('categories', updated)
  return updated
}

/**
 * Delete a category by ID
 */
async function hardDeleteCategory(id: string): Promise<void> {
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

const categoryServices = {
  getAllCategories,
  getCategoriesByIndex,
  getCategoriesByType,
  getCategoryById,
  putCategory,
  putCategories,
  deleteCategory,
  hardDeleteCategory,
  clearCategories,
}

export default categoryServices

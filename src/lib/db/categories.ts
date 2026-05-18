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

const categoryServices = {
  getAllCategories,
  getCategoriesByType,
  getCategoryById,
  putCategory,
  putCategories,
  deleteCategory,
  clearCategories,
}

export default categoryServices

import { createContext, useContext } from 'react'
import { Category, CategoryType } from '@/types'

export type CategoriesContextValue = {
  selectedCategory: CategoryType
  setSelectedCategory: React.Dispatch<React.SetStateAction<CategoryType>>
  /** The category whose options menu is open, or `null` when none is open. */
  selectedCategoryId: string | null
  setSelectedCategoryId: React.Dispatch<React.SetStateAction<string | null>>
  /** Active categories of the selected type, in display order (store-derived). */
  filteredCategory: Category[]
}

export const CategoriesContext = createContext<CategoriesContextValue | null>(
  null
)

export const useCategoriesContext = () => {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error(
      'useCategoriesContext must be used within a CategoriesProvider'
    )
  }
  return context
}

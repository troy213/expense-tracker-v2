import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppSelector } from '@/hooks'
import { CategoryType } from '@/types'
import { CategoriesContext, CategoriesContextValue } from './CategoriesContext'

const getCategoryTypeFromParam = (param: string | null): CategoryType =>
  param === 'expense' ? 'expense' : 'income'

export const CategoriesProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { search } = useLocation()
  const categoryParam = new URLSearchParams(search).get('cat')

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(() =>
    getCategoryTypeFromParam(categoryParam)
  )
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  )

  const { categories } = useAppSelector((state) => state.categoriesReducer)

  const filteredCategory = useMemo(
    () =>
      categories.filter(
        (category) => category.type === selectedCategory && category.is_active
      ),
    [categories, selectedCategory]
  )

  // Keep the active tab in sync with the `?cat=` query param.
  useEffect(() => {
    setSelectedCategory(getCategoryTypeFromParam(categoryParam))
  }, [categoryParam])

  const value = useMemo<CategoriesContextValue>(
    () => ({
      selectedCategory,
      setSelectedCategory,
      selectedCategoryId,
      setSelectedCategoryId,
      filteredCategory,
    }),
    [selectedCategory, selectedCategoryId, filteredCategory]
  )

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  )
}

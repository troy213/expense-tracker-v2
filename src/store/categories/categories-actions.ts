import { PayloadAction } from '@reduxjs/toolkit'
import { Category } from '@/types'
import { InitialState } from './categories-slice'

export const addCategory = (
  state: InitialState,
  action: PayloadAction<Category>
) => {
  state.categories = [...state.categories, action.payload]
  state.isLoading = false
}

export const addCategories = (
  state: InitialState,
  action: PayloadAction<Category[]>
) => {
  state.categories = action.payload
  state.isLoading = false
}

export const editCategory = (
  state: InitialState,
  action: PayloadAction<Category>
) => {
  const newCategories = state.categories.map((category) => {
    if (category.id === action.payload.id) return action.payload
    return category
  })

  state.categories = newCategories
  state.isLoading = false
}

export const deleteCategory = (
  state: InitialState,
  action: PayloadAction<{ id: string; updated: Category | null }>
) => {
  const { id, updated } = action.payload

  if (updated === null) {
    state.categories = state.categories.filter((category) => category.id !== id)
    state.isLoading = false
    return
  }

  state.categories = state.categories.map((category) =>
    category.id === id ? updated : category
  )
  state.isLoading = false
}

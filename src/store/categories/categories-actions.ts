import { PayloadAction } from '@reduxjs/toolkit'
import { Category } from '@/types'
import { InitialState } from './categories-slice'

export const addCategory = (
  state: InitialState,
  action: PayloadAction<Category>
) => {
  state.categories = [...state.categories, action.payload]
}

export const addCategories = (
  state: InitialState,
  action: PayloadAction<Category[]>
) => {
  state.categories = action.payload
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
}

export const deleteCategory = (
  state: InitialState,
  action: PayloadAction<Category>
) => {
  const newCategories = state.categories.filter(
    (category) => category.id !== action.payload.id
  )
  state.categories = newCategories
}

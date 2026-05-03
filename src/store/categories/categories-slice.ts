import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Category, SetStatePayload } from '@/types'
import { setStateReducerValue, setStorage } from '@/utils'
import {
  addCategories,
  addCategory,
  deleteCategory,
  editCategory,
} from './categories-actions'
import {
  addDBCategory,
  editDBCategory,
  deleteDBCategory,
  addDBCategories,
  deleteAllDBCategories,
} from './categories-thunk'

export type InitialState = {
  categories: Category[]
}

const initialState: InitialState = {
  categories: [],
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory,
    addCategories,
    editCategory,
    deleteCategory,
    sortCategories(
      state,
      action: PayloadAction<{
        filteredCategory: Category[]
        selectedCategory: string
      }>
    ) {
      const categories = state.categories.filter(
        (category) => category.type !== action.payload.selectedCategory
      )
      const newCategories = [...categories, ...action.payload.filteredCategory]

      state.categories = newCategories
      setStorage('categories', newCategories)
    },
    setState(
      state: InitialState,
      action: PayloadAction<SetStatePayload<InitialState>>
    ) {
      const { state: key, value } = action.payload

      setStateReducerValue(state, key, value)
    },
    resetState() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addDBCategory.fulfilled, addCategory)
    builder.addCase(addDBCategories.fulfilled, addCategories)
    builder.addCase(editDBCategory.fulfilled, editCategory)
    builder.addCase(deleteDBCategory.fulfilled, deleteCategory)
    builder.addCase(deleteAllDBCategories.fulfilled, () => {
      return initialState
    })
  },
})

export const categoriesAction = categoriesSlice.actions

export default categoriesSlice

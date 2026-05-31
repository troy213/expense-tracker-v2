import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Category, SetStatePayload } from '@/types'
import { setStateReducerValue, setStorage } from '@/utils'
import { addAsyncThunkCases } from '../utils'
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
  isLoading: boolean
  categories: Category[]
}

const initialState: InitialState = {
  isLoading: true,
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
      return { ...initialState, isLoading: false }
    },
  },
  extraReducers: (builder) => {
    addAsyncThunkCases(builder, addDBCategory, 'isLoading', addCategory)
    addAsyncThunkCases(builder, addDBCategories, 'isLoading', addCategories)
    addAsyncThunkCases(builder, editDBCategory, 'isLoading', editCategory)
    addAsyncThunkCases(builder, deleteDBCategory, 'isLoading', deleteCategory)
    addAsyncThunkCases(builder, deleteAllDBCategories, 'isLoading', () => {
      return { ...initialState, isLoading: false }
    })
  },
})

export const categoriesAction = categoriesSlice.actions

export default categoriesSlice

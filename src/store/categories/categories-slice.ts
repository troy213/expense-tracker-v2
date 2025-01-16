import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Category, SetStatePayload } from '@/types'
import { setStateReducerValue, setStorage } from '@/utils'

type InitialState = {
  categories: Category[]
}

const initialState: InitialState = {
  categories: [],
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload
      setStorage('categories', action.payload)
    },
    updateCategories(state, action: PayloadAction<Category>) {
      const newCategories = state.categories.map((category) => {
        if (category.id === action.payload.id) return action.payload
        return category
      })

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
    deleteCategory(state, action: PayloadAction<{ id: string }>) {
      const newCategories = state.categories.filter(
        (category) => category.id !== action.payload.id
      )
      state.categories = newCategories
      setStorage('categories', newCategories)
    },
    resetState() {
      return initialState
    },
  },
})

export const categoriesAction = categoriesSlice.actions

export default categoriesSlice

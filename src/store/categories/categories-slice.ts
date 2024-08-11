import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Category, SetStatePayload } from '@/types'

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
    },
    setState<K extends keyof InitialState>(
      state: InitialState,
      action: PayloadAction<SetStatePayload<InitialState, K>>
    ) {
      const { state: key, value } = action.payload

      state[key] = value
    },
    resetState() {
      return initialState
    },
  },
})

export const categoriesAction = categoriesSlice.actions

export default categoriesSlice

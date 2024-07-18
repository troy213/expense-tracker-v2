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
    setState(
      state: InitialState,
      action: PayloadAction<SetStatePayload<InitialState>>
    ) {
      state[action.payload.state] = action.payload.value
    },
    resetState() {
      return initialState
    },
  },
})

export const categoriesAction = categoriesSlice.actions

export default categoriesSlice

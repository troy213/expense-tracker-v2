import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Category, SetStatePayload } from '@/types'
import { setStateReducerValue, setStorage } from '@/utils'
import { v4 as uuidv4 } from 'uuid'

type InitialState = {
  categories: Category[]
}

const initialState: InitialState = {
  categories: [
    { name: 'Salary', budget: 0, type: 'income', id: uuidv4() },
    { name: 'Food & Beverages', budget: 0, type: 'expense', id: uuidv4() },
    { name: 'Transportation', budget: 0, type: 'expense', id: uuidv4() },
    { name: 'Shopping', budget: 0, type: 'expense', id: uuidv4() },
  ],
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload
      setStorage('categories', action.payload)
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
})

export const categoriesAction = categoriesSlice.actions

export default categoriesSlice

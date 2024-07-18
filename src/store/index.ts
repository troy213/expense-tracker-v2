import { configureStore } from '@reduxjs/toolkit'
import categoriesSlice from './categories/categories-slice'
import dataSlice from './data/data-slice'

const store = configureStore({
  reducer: {
    categoriesReducer: categoriesSlice.reducer,
    dataReducer: dataSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

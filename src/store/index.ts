import { configureStore } from '@reduxjs/toolkit'
import categoriesSlice from './categories/categories-slice'
import mainSlice from './main/main-slice'

const store = configureStore({
  reducer: {
    categoriesReducer: categoriesSlice.reducer,
    mainReducer: mainSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

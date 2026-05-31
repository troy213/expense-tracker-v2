import { configureStore } from '@reduxjs/toolkit'
import categoriesSlice from './categories/categories-slice'
import configSlice from './config/config-slice'
import mainSlice from './main/main-slice'
import reportSlice from './report/report-slice'

const store = configureStore({
  reducer: {
    categoriesReducer: categoriesSlice.reducer,
    configReducer: configSlice.reducer,
    mainReducer: mainSlice.reducer,
    reportReducer: reportSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

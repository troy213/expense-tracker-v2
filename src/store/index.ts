import { configureStore } from '@reduxjs/toolkit'
import categoriesSlice from './categories/categories-slice'
import configSlice from './config/config-slice'
import goalDetailSlice from './goal-detail/goal-detail-slice'
import goalsSlice from './goals/goals-slice'
import mainSlice from './main/main-slice'
import recurringSlice from './recurring/recurring-slice'
import reportSlice from './report/report-slice'
import reportDetailSlice from './report-detail/report-detail-slice'
import transactionsSlice from './transactions/transactions-slice'

const store = configureStore({
  reducer: {
    categoriesReducer: categoriesSlice.reducer,
    configReducer: configSlice.reducer,
    goalDetailReducer: goalDetailSlice.reducer,
    goalsReducer: goalsSlice.reducer,
    mainReducer: mainSlice.reducer,
    recurringReducer: recurringSlice.reducer,
    reportReducer: reportSlice.reducer,
    reportDetailReducer: reportDetailSlice.reducer,
    transactionsReducer: transactionsSlice.reducer,
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

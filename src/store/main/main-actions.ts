import { PayloadAction } from '@reduxjs/toolkit'
import { Transaction, TxFormData } from '@/types'
import { processMainData } from '@/utils'
import { InitialState } from './main-slice'

export const addData = (
  state: InitialState,
  action: PayloadAction<{ data: TxFormData }>
) => {
  const { data } = action.payload

  // if data doesn't exist, create new item
  const index = state.data.findIndex((d) => d.date === data.date)

  if (!state.data[index]) {
    state.data.push({
      date: data.date,
      subdata: [
        {
          category_id: data.category_id,
          item: data.item,
        },
      ],
    })
  } else {
    const subdataIndex = state.data[index].subdata.findIndex(
      (item) => item.category_id === data.category_id
    )

    // if transaction exist, update the subdata item else update the subdata
    if (subdataIndex >= 0) {
      state.data[index].subdata[subdataIndex].item.push(...data.item)
    } else {
      state.data[index].subdata.push({
        category_id: data.category_id,
        item: data.item,
      })
    }
  }
  state.data.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  state.isLoading = false
}

export const editData = (
  state: InitialState,
  action: PayloadAction<{
    data: TxFormData
    oldCategoryId: string
    index: number
  }>
) => {
  const { data, index, oldCategoryId } = action.payload
  const targetCategoryId = oldCategoryId || data.category_id

  // remove old data from the current index
  const dayEntry = state.data[index]
  if (dayEntry) {
    dayEntry.subdata = dayEntry.subdata.filter(
      (s) => s.category_id !== targetCategoryId
    )

    // if that day now has 0 categories, remove the day entirely
    if (dayEntry.subdata.length === 0) {
      state.data.splice(index, 1)
    }
  }

  // insert the new data into the correct date/index
  const newDateIndex = state.data.findIndex((d) => d.date === data.date)

  if (newDateIndex === -1) {
    // if date doesn't exist in data, create new one
    state.data.push({
      date: data.date,
      subdata: [{ category_id: data.category_id, item: data.item }],
    })
  } else {
    const subIndex = state.data[newDateIndex].subdata.findIndex(
      (s) => s.category_id === data.category_id
    )

    if (subIndex >= 0) {
      // Category already exist in this date group, just update the item
      state.data[newDateIndex].subdata[subIndex].item.push(...data.item)
    } else {
      // Category didn't exist in this date group yet
      state.data[newDateIndex].subdata.push({
        category_id: data.category_id,
        item: data.item,
      })
    }
  }

  // sort the data from the recent one
  state.data.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  state.isLoading = false
}

export const deleteData = (
  state: InitialState,
  action: PayloadAction<{ data: TxFormData; index: number }>
) => {
  const { index, data } = action.payload

  const dayEntry = state.data[index]
  if (!dayEntry) return

  // 1. Remove the specific category from the subdata array
  dayEntry.subdata = dayEntry.subdata.filter(
    (sub) => sub.category_id !== data.category_id
  )

  // 2. Clean up: If no categories left for this date, remove the date entry
  if (dayEntry.subdata.length === 0) {
    state.data.splice(index, 1)
  }
}

export const searchData = (
  state: InitialState,
  action: PayloadAction<{ searchValue: string; transactions: Transaction[] }>
) => {
  const { searchValue, transactions } = action.payload

  state.searchValue = searchValue
  state.data = processMainData(transactions)

  state.data.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  state.isLoading = false
}

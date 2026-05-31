import { createAsyncThunk } from '@reduxjs/toolkit'
import { Transaction, TxFormData } from '@/types'
import dbServices from '@/lib/db'

export const addDBTransactions = createAsyncThunk(
  'transactions/addTransactions',
  async (payload: { data: TxFormData }) => {
    const { data } = payload

    // Prepare the DB payload
    const transactionDBPayload: Transaction[] = data.item.map((item) => ({
      ...item,
      date: data.date,
      category_id: data.category_id,
    }))

    // 1. Perform the async DB operation
    await dbServices.transactions.putTransactions(transactionDBPayload)

    // 2. Return the data to update the Redux state
    return payload
  }
)

export const editDBTransactions = createAsyncThunk(
  'transactions/editTransactions',
  async (payload: {
    data: TxFormData
    oldDate: string
    oldCategoryId: string
    index: number
  }) => {
    const { data, oldDate, oldCategoryId } = payload
    const isSameDate = oldDate === data.date
    const isSameCategory = oldCategoryId === data.category_id

    const transactionDBPayload: Transaction[] = data.item.map((item) => ({
      ...item,
      date: data.date,
      category_id: data.category_id,
    }))

    // If the date or category has changed, we need to delete the old transactions and add the new ones
    if (!isSameDate || (!isSameCategory && isSameDate)) {
      await dbServices.transactions.putTransactions(transactionDBPayload)
    } else {
      // If the date and category are the same, replace the existing transactions with the new ones
      const allStored = await dbServices.transactions.getTransactionsByCategory(
        data.category_id
      )

      const existingInThisGroup = allStored.filter(
        (tx) => tx.date === data.date
      )

      const newItemIds = new Set(data.item.map((i) => i.id))
      const idsToDelete = existingInThisGroup
        .map((tx) => tx.id)
        .filter((id) => !newItemIds.has(id))

      await dbServices.transactions.deleteTransactions(idsToDelete)
      await dbServices.transactions.putTransactions(transactionDBPayload)
    }

    return payload
  }
)

export const deleteDBTransactions = createAsyncThunk(
  'transactions/deleteTransactions',
  async (payload: { data: TxFormData; index: number }) => {
    const { data } = payload
    const ids = data.item.map((tx) => tx.id)

    await dbServices.transactions.deleteTransactions(ids)

    return payload
  }
)

export const deleteAllDBTransactions = createAsyncThunk(
  'transactions/deleteAllTransactions',
  async () => {
    await dbServices.transactions.clearTransactions()
  }
)

import { createAsyncThunk } from '@reduxjs/toolkit'
import { Category } from '@/types'
import dbServices from '@/lib/db'

export const addDBCategory = createAsyncThunk(
  'categories/addDBCategory',
  async (payload: Category) => {
    await dbServices.putCategory(payload)

    return payload
  }
)

export const addDBCategories = createAsyncThunk(
  'categories/addDBCategories',
  async (payload: Category[]) => {
    await dbServices.putCategories(payload)

    return payload
  }
)

export const editDBCategory = createAsyncThunk(
  'categories/editDBCategory',
  async (payload: Category) => {
    await dbServices.putCategory(payload)

    return payload
  }
)

export const deleteDBCategory = createAsyncThunk(
  'categories/deleteDBCategory',
  async (payload: Category) => {
    await dbServices.deleteCategory(payload.id)

    return payload
  }
)

export const deleteAllDBCategories = createAsyncThunk(
  'categories/deleteAllCategories',
  async () => {
    await dbServices.clearCategories()
  }
)

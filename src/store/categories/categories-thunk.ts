import { createAsyncThunk } from '@reduxjs/toolkit'
import { Category } from '@/types'
import dbServices from '@/lib/db'

export const addDBCategory = createAsyncThunk(
  'categories/addDBCategory',
  async (payload: Category) => {
    await dbServices.categories.putCategory(payload)

    return payload
  }
)

export const addDBCategories = createAsyncThunk(
  'categories/addDBCategories',
  async (payload: Category[]) => {
    await dbServices.categories.putCategories(payload)

    return payload
  }
)

export const editDBCategory = createAsyncThunk(
  'categories/editDBCategory',
  async (payload: Category) => {
    await dbServices.categories.putCategory(payload)

    return payload
  }
)

export const deleteDBCategory = createAsyncThunk(
  'categories/deleteDBCategory',
  async (payload: Category) => {
    const updated = await dbServices.categories.deleteCategory(payload.id)

    return { id: payload.id, updated }
  }
)

export const deleteAllDBCategories = createAsyncThunk(
  'categories/deleteAllCategories',
  async () => {
    await dbServices.categories.clearCategories()
  }
)

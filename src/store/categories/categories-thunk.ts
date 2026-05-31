import { createAsyncThunk } from '@reduxjs/toolkit'
import { Category } from '@/types'
import dbServices from '@/lib/db'

export const getAllDBCategories = createAsyncThunk(
  'categories/getAllCategories',
  async () => {
    return await dbServices.categories.getCategoriesByIndex()
  }
)

export const addDBCategory = createAsyncThunk(
  'categories/addCategory',
  async (payload: Category) => {
    await dbServices.categories.putCategory(payload)

    return payload
  }
)

export const addDBCategories = createAsyncThunk(
  'categories/addCategories',
  async (payload: Category[]) => {
    await dbServices.categories.putCategories(payload)

    return payload
  }
)

export const editDBCategory = createAsyncThunk(
  'categories/editCategory',
  async (payload: Category) => {
    await dbServices.categories.putCategory(payload)

    return payload
  }
)

export const deleteDBCategory = createAsyncThunk(
  'categories/deleteCategory',
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

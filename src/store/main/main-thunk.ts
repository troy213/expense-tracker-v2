import { createAsyncThunk } from '@reduxjs/toolkit'
import dbServices from '@/lib/db'

export const getDBDashboardInfo = createAsyncThunk(
  'main/getDashboardInfo',
  async () => {
    const dashboardInfo = await dbServices.report.getDashboardInfo()

    return dashboardInfo
  }
)

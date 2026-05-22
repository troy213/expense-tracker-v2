import { createAsyncThunk } from '@reduxjs/toolkit'
import dbServices from '@/lib/db'

export const getDBDashboardInfo = createAsyncThunk(
  'report/getDashboardInfo',
  async () => {
    const dashboardInfo = await dbServices.report.getDashboardInfo()

    return dashboardInfo
  }
)

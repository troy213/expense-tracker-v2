import { createAsyncThunk } from '@reduxjs/toolkit'
import dbServices from '@/lib/db'

export const getDBReportData = createAsyncThunk(
  'report/getReportData',
  async (payload: { dateFrom: string | null; dateTo: string | null }) => {
    const { dateFrom, dateTo } = payload
    return dbServices.report.getReportData(dateFrom, dateTo)
  }
)

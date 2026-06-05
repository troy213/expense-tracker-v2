import { useEffect } from 'react'
import { Navbar } from '@/components'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { getDBReportData } from '@/store/report/report-thunk'
import { getDateRangeForFilter } from '@/utils'
import ReportInfo from './ReportInfo'
import TimeFilterTab from './TimeFilterTab'
import ReportWidget from './ReportWidget'
import './index.scss'

const Reports = () => {
  const dispatch = useAppDispatch()
  const { data } = useAppSelector((state) => state.transactionsReducer)
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const {
    timeFilter,
    customRange,
    totalIncome,
    totalExpense,
    avgSpending,
    incomeReport,
    expenseReport,
  } = useAppSelector((state) => state.reportReducer)

  const { dateFrom, dateTo } = getDateRangeForFilter(
    timeFilter,
    customRange ?? undefined
  )

  useEffect(() => {
    dispatch(getDBReportData({ dateFrom, dateTo }))
  }, [dispatch, dateFrom, dateTo, data, categories])

  const totalBalance = totalIncome - totalExpense

  return (
    <div className="reports">
      <div className="flex-column gap-4 p-4">
        <Navbar enableBackButton={true} title="Reports"></Navbar>

        <TimeFilterTab
          dateFrom={dateFrom}
          dateTo={dateTo}
          timeFilter={timeFilter}
        />

        <ReportInfo
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          totalBalance={totalBalance}
          avgExpense={avgSpending}
        />

        <div className="flex-column gap-4 mt-4">
          {incomeReport.length > 0 && (
            <ReportWidget
              type="income"
              report={incomeReport}
              typeTotal={totalIncome}
              dateFrom={dateFrom}
              dateTo={dateTo}
            />
          )}

          {expenseReport.length > 0 && (
            <ReportWidget
              type="expense"
              report={expenseReport}
              typeTotal={totalExpense}
              dateFrom={dateFrom}
              dateTo={dateTo}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports

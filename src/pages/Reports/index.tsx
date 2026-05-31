import { Navbar } from '@/components'
import { useAppSelector } from '@/hooks'
import { Data, ReportCategory } from '@/types'
import {
  calculateAverageSpending,
  getCategoryById,
  getDate,
  getDateRangeForFilter,
  updateTotal,
} from '@/utils'
import ReportInfo from './ReportInfo'
import ReportTimeTab from './ReportTimeTab'
import ReportWidget from './ReportWidget'

const Reports = () => {
  const { data } = useAppSelector((state) => state.transactionsReducer)
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const { dateRange, customRange } = useAppSelector(
    (state) => state.reportReducer
  )

  const today = getDate()

  const { dateFrom, dateTo } = getDateRangeForFilter(
    dateRange,
    customRange ?? undefined
  )

  const filteredData: Data[] =
    dateFrom && dateTo
      ? data.filter((item) => item.date >= dateFrom && item.date <= dateTo)
      : data

  const { totalIncome, totalExpense, totalBalance } = updateTotal(
    filteredData,
    categories
  )
  const avgExpense = calculateAverageSpending(
    data,
    categories,
    dateFrom,
    dateTo,
    today
  )

  const generateReport = (type: string): ReportCategory[] =>
    categories
      .filter((category) => category.type === type)
      .map((category) => {
        const catAmount = filteredData
          .flatMap((entry) => entry.subdata)
          .filter((sub) => {
            const subType = getCategoryById(sub.category_id, categories)?.type
            return subType === type && sub.category_id === category.id
          })
          .flatMap((sub) => sub.item)
          .reduce((total, curr) => total + curr.amount, 0)

        return { ...category, total: catAmount }
      })
      .filter((cat) => cat.total > 0)
      .sort((a, b) => b.total - a.total)

  const incomeReport = generateReport('income')
  const expenseReport = generateReport('expense')

  return (
    <div className="reports">
      <div className="flex-column gap-4 p-4">
        <Navbar enableBackButton={true} title="Reports"></Navbar>

        <ReportTimeTab
          dateFrom={dateFrom}
          dateTo={dateTo}
          dateRange={dateRange}
        />

        <ReportInfo
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          totalBalance={totalBalance}
          avgExpense={avgExpense}
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

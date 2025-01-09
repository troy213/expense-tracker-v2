import { MoreVerticalSvg } from '@/assets'
import { Navbar, Toolbar } from '@/components'
import ReportInfo from './ReportInfo'
import ReportWidget from './ReportWidget'
import { useAppSelector } from '@/hooks'
import { getCurrentMonthRange, updateTotal } from '@/utils'

const Reports = () => {
  const { data } = useAppSelector((state) => state.mainReducer)
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const { firstDate, lastDate } = getCurrentMonthRange()

  const startDate = new Date(firstDate)
  const endDate = new Date(lastDate)

  const totalDays =
    (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.date)
    return itemDate >= startDate && itemDate <= endDate
  })
  const { totalIncome, totalExpense, totalBalance } = updateTotal(filteredData)
  const avgExpense = totalExpense / totalDays
  const generateReport = (type: string) =>
    categories
      .filter((category) => category.type === type)
      .map((category) => {
        const catAmount = filteredData
          .flatMap((data) => data.subdata)
          .filter((sub) => sub.type === type && sub.category === category.name)
          .flatMap((sub) => sub.item)
          .reduce((total, curr) => total + curr.amount, 0)

        return {
          category: category.name,
          total: catAmount,
        }
      })

  const incomeReport = generateReport('income')
  const expenseReport = generateReport('expense')
  return (
    <div className="reports">
      <div className="flex-column gap-4 p-4">
        <Navbar enableBackButton={true} title="Reports">
          <button type="button" className="btn btn-clear">
            <MoreVerticalSvg className="icon--stroke-primary" />
          </button>
        </Navbar>

        <ReportInfo
          firstDate={firstDate}
          lastDate={lastDate}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          totalBalance={totalBalance}
          avgExpense={avgExpense}
        />

        <ReportWidget
          type="income"
          report={incomeReport}
          typeTotal={totalIncome}
        />
        <ReportWidget
          type="expense"
          report={expenseReport}
          typeTotal={totalExpense}
        />
      </div>
      <Toolbar />
    </div>
  )
}

export default Reports

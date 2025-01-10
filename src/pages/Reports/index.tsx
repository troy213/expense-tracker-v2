import { MoreVerticalSvg } from '@/assets'
import { Navbar, Toolbar } from '@/components'
import ReportInfo from './ReportInfo'
import ReportWidget from './ReportWidget'
import { useAppSelector } from '@/hooks'
import { calculateModalBottomThreshold, updateTotal } from '@/utils'
import { useRef, useState } from 'react'
// import MoreOptionModal from '@/components/Modal/MoreOptionModal'
import DateRangeModal from '@/components/Modal/DateRangeModal'
import { Data } from '@/types'

const Reports = () => {
  const { data } = useAppSelector((state) => state.mainReducer)
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  // const { firstDate, lastDate } = getCurrentMonthRange()
  const [moreOptionModalClassName, setMoreOptionModalClassName] = useState('')
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false)
  const [dateRange, setDateRange] = useState(0)
  const now = new Date()

  const getDateRange = (range: number) => {
    switch (range) {
      case 1:
        return [
          new Date(now.getFullYear(), now.getMonth(), 1),
          new Date(now.getFullYear(), now.getMonth() + 1, 0),
        ]
      case 2:
        return [
          new Date(now.getFullYear(), now.getMonth() - 1, 1),
          new Date(now.getFullYear(), now.getMonth(), 0),
        ]
      case 3:
        return [
          new Date(now.getFullYear(), 0, 1),
          new Date(now.getFullYear(), 11, 31),
        ]
      default:
        return [null, null]
    }
  }
  const [startDate, endDate] = getDateRange(dateRange)
  const filteredData: Data[] =
    dateRange === 0
      ? data
      : data.filter((item) => {
          const itemDate = new Date(item.date)
          return (
            itemDate >= (startDate ?? new Date(0)) &&
            itemDate <= (endDate ?? new Date(0))
          )
        })

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }
  const totalDays =
    startDate && endDate
      ? (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
      : 1

  const { totalIncome, totalExpense, totalBalance } = updateTotal(filteredData)
  const avgExpense = totalExpense / totalDays

  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleChangeDateRange = (range: number) => {
    setDateRange(range)
    setIsMoreModalOpen((val) => !val)
  }

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
      .filter((cat) => cat.total > 0)
      .sort((a, b) => b.total - a.total)

  const getModalPositionClassName = (elementRect: DOMRect | undefined) => {
    const modalBottomThreshold = calculateModalBottomThreshold()
    const viewPortHeight = window.innerHeight
    const elementSizeDiff = viewPortHeight - (elementRect?.bottom ?? 0)

    if (elementSizeDiff < modalBottomThreshold) return 'modal--top'
    return ''
  }

  const incomeReport = generateReport('income')
  const expenseReport = generateReport('expense')
  const handleMoreOption = () => {
    const elementRect = buttonRef.current?.getBoundingClientRect()
    setMoreOptionModalClassName(getModalPositionClassName(elementRect))
    setIsMoreModalOpen((val) => !val)
  }
  return (
    <div className="reports">
      <div className="flex-column gap-4 p-4">
        <Navbar enableBackButton={true} title="Reports">
          <>
            <button
              type="button"
              className="btn btn-clear"
              ref={buttonRef}
              onClick={handleMoreOption}
            >
              <MoreVerticalSvg className="icon--stroke-primary" />
            </button>
            {isMoreModalOpen && (
              <DateRangeModal
                className={moreOptionModalClassName}
                handleChangeDateRange={handleChangeDateRange}
              />
            )}
          </>
        </Navbar>

        <ReportInfo
          firstDate={
            startDate ? startDate.toLocaleString('en-US', options) : ''
          }
          lastDate={endDate ? endDate.toLocaleString('en-US', options) : ''}
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

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
import InputDateModal from '@/components/Modal/InputDateModal'

const Reports = () => {
  const { data } = useAppSelector((state) => state.mainReducer)
  const now = new Date()
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  // const { firstDate, lastDate } = getCurrentMonthRange()
  const [moreOptionModalClassName, setMoreOptionModalClassName] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(data[data.length - 1]?.date)
  )
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59)
  )
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false)
  const [isDateModalOpen, setIsDateModalOpen] = useState(false)
  const [dateRange, setDateRange] = useState(0)

  const OpenDateFilterModal = () => {
    setIsDateModalOpen(!isDateModalOpen)
  }
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

  const SetCustomDate = (start: Date, end: Date) => {
    setStartDate(start)
    setEndDate(end)
  }

  const handleChangeDateRange = (range: number) => {
    setIsMoreModalOpen((val) => !val)
    if (range === 4) {
      OpenDateFilterModal()
    } else {
      setDateRange(range)
      switch (range) {
        case 0:
          setStartDate(new Date(data[data.length - 1].date))
          setEndDate(
            new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59)
          )
          break
        case 1:
          setStartDate(new Date(now.getFullYear(), now.getMonth(), 1))
          setEndDate(
            new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59)
          )
          break
        case 2:
          setStartDate(new Date(now.getFullYear(), now.getMonth() - 1, 1))
          setEndDate(
            new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
          )
          break
        case 3:
          setStartDate(new Date(now.getFullYear(), 0, 1))
          setEndDate(
            new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59)
          )
          break
        default:
          setStartDate(null)
          setEndDate(null)
      }
    }
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
            {isDateModalOpen && (
              <InputDateModal
                isOpen={isDateModalOpen}
                setIsOpen={OpenDateFilterModal}
                SetCustomDate={SetCustomDate}
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

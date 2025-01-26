import { useEffect, useRef, useState } from 'react'
import { MoreVerticalSvg } from '@/assets'
import { Navbar, Toolbar } from '@/components'
import { DATE_RANGE } from '@/constants'
import DateRangeModal from '@/components/Modal/DateRangeModal'
import InputDateModal from '@/components/Modal/InputDateModal'
import { useAppSelector } from '@/hooks'
import { Data } from '@/types'
import { calculateModalBottomThreshold, updateTotal } from '@/utils'
import ReportInfo from './ReportInfo'
import ReportWidget from './ReportWidget'

const Reports = () => {
  const { data } = useAppSelector((state) => state.mainReducer)
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const [moreOptionModalClassName, setMoreOptionModalClassName] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false)
  const [isDateModalOpen, setIsDateModalOpen] = useState(false)
  const [dateRange, setDateRange] = useState(DATE_RANGE.ALL_TIME)
  const now = new Date()

  const openDateFilterModal = () => {
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
    if (range === DATE_RANGE.CUSTOM_FILTER) {
      openDateFilterModal()
    } else {
      setDateRange(range)
      switch (range) {
        case DATE_RANGE.THIS_MONTH:
          setStartDate(new Date(now.getFullYear(), now.getMonth(), 1))
          setEndDate(
            new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59)
          )
          break
        case DATE_RANGE.LAST_MONTH:
          setStartDate(new Date(now.getFullYear(), now.getMonth() - 1, 1))
          setEndDate(
            new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
          )
          break
        case DATE_RANGE.THIS_YEAR:
          setStartDate(new Date(now.getFullYear(), 0, 1))
          setEndDate(
            new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59)
          )
          break
        // DATE_RANGE.ALL_TIME:
        default:
          return
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

  useEffect(() => {
    if (dateRange === DATE_RANGE.ALL_TIME) {
      const defaultStartDate = data.length
        ? new Date(data[data.length - 1].date)
        : null
      const defaultEndDate = data.length ? new Date(data[0].date) : null

      setStartDate(defaultStartDate)
      setEndDate(defaultEndDate)
    }
  }, [data, dateRange])

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
                setIsOpen={openDateFilterModal}
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

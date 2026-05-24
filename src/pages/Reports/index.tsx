import { useRef, useState } from 'react'
import { MoreVerticalSvg } from '@/assets'
import { Navbar } from '@/components'
import { DATE_RANGE } from '@/constants'
import DateRangeModal from '@/components/Modal/DateRangeModal'
import InputDateModal from '@/components/Modal/InputDateModal'
import { useAppDispatch, useAppSelector, useClickOutside } from '@/hooks'
import { Data, ReportCategory } from '@/types'
import {
  calculateAverageSpending,
  getCategoryById,
  getDate,
  getDateRangeForFilter,
  toDateKey,
  updateTotal,
} from '@/utils'
import ReportInfo from './ReportInfo'
import ReportWidget from './ReportWidget'
import { reportAction } from '@/store/report/report-slice'

const Reports = () => {
  const { data } = useAppSelector((state) => state.mainReducer)
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const { dateRange, customRange } = useAppSelector(
    (state) => state.reportReducer
  )
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false)
  const [isDateModalOpen, setIsDateModalOpen] = useState(false)

  const dispatch = useAppDispatch()

  const buttonRef = useRef<HTMLButtonElement>(null)
  const dateRangeModalRef = useRef<HTMLDivElement>(null)
  useClickOutside(
    dateRangeModalRef,
    () => setIsMoreModalOpen(false),
    isMoreModalOpen
  )

  const now = new Date()
  const today = getDate()

  const { dateFrom, dateTo } = getDateRangeForFilter(
    dateRange,
    now,
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

  const openDateFilterModal = () => setIsDateModalOpen((val) => !val)
  const handleMoreOption = () => setIsMoreModalOpen((val) => !val)

  const setCustomDate = (from: string, to: string) => {
    dispatch(
      reportAction.setState({ state: 'customRange', value: { from, to } })
    )
  }

  const handleChangeDateRange = (range: number) => {
    setIsMoreModalOpen(false)
    dispatch(reportAction.setState({ state: 'dateRange', value: range }))
    if (range === DATE_RANGE.CUSTOM_FILTER) {
      openDateFilterModal()
    }
  }

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

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }
  const formatLabel = (key: string) =>
    new Date(`${key}T00:00:00`).toLocaleString('en-US', options)

  return (
    <div className="reports">
      <div className="flex-column gap-4 p-4">
        <Navbar enableBackButton={true} title="Reports">
          <div className="relative">
            <button
              type="button"
              className="btn btn-clear"
              ref={buttonRef}
              onClick={handleMoreOption}
            >
              <MoreVerticalSvg className="icon--stroke-primary" />
            </button>
            {isMoreModalOpen && (
              <div ref={dateRangeModalRef}>
                <DateRangeModal
                  dateRange={dateRange}
                  handleChangeDateRange={handleChangeDateRange}
                />
              </div>
            )}
            {isDateModalOpen && (
              <InputDateModal
                isOpen={isDateModalOpen}
                setIsOpen={openDateFilterModal}
                SetCustomDate={(from: Date, to: Date) =>
                  setCustomDate(toDateKey(from), toDateKey(to))
                }
              />
            )}
          </div>
        </Navbar>

        <ReportInfo
          firstDate={dateFrom ? formatLabel(dateFrom) : ''}
          lastDate={dateTo ? formatLabel(dateTo) : ''}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          totalBalance={totalBalance}
          avgExpense={avgExpense}
        />

        <ReportWidget
          type="income"
          report={incomeReport}
          typeTotal={totalIncome}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
        <ReportWidget
          type="expense"
          report={expenseReport}
          typeTotal={totalExpense}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      </div>
    </div>
  )
}

export default Reports

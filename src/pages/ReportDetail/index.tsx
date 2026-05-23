import { useEffect, useMemo, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { Virtuoso } from 'react-virtuoso'
import { useIntl } from 'react-intl'
import { Navbar } from '@/components'
import { useAppDispatch, useAppSelector, useExpandableGroups } from '@/hooks'
import { getFilteredTransactionsThunk } from '@/store/report/report-thunk'
import { reportAction } from '@/store/report/report-slice'
import { TransactionFilters } from '@/types'
import {
  formatMonthLabel,
  getCategoryById,
  shouldShowMonthHeader,
  updateTotal,
} from '@/utils'
import type { LayoutContextType } from '@/components/Layout'
import TransactionContainer from '@/pages/Dashboard/Transactions/TransactionContainer'
import ReportDetailInfo from './ReportDetailInfo'

const DEFAULT_EXPANDED_COUNT = 3

const ReportDetail = () => {
  const { scrollParent } = useOutletContext<LayoutContextType>()
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const { data } = useAppSelector((state) => state.mainReducer)
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const { detailData, isDetailLoading } = useAppSelector(
    (state) => state.reportReducer
  )

  const [selectedTransaction, setSelectedTransaction] = useState('')
  const { isExpanded, toggle } = useExpandableGroups(
    detailData,
    (group) => group.date,
    DEFAULT_EXPANDED_COUNT
  )

  // Parse the URL params into a filter object.
  const filters = useMemo<TransactionFilters>(() => {
    const type = searchParams.get('type')
    const category_id = searchParams.get('category_id')
    const search = searchParams.get('search')
    const date_from = searchParams.get('date_from')
    const date_to = searchParams.get('date_to')
    return {
      ...(type === 'income' || type === 'expense' ? { type } : {}),
      ...(category_id ? { category_id } : {}),
      ...(search ? { search } : {}),
      ...(date_from ? { date_from } : {}),
      ...(date_to ? { date_to } : {}),
    }
  }, [searchParams])

  // Re-query on param change AND when the underlying data/categories change
  // (keeps the DB-derived list in sync after inline edit/delete).
  useEffect(() => {
    dispatch(getFilteredTransactionsThunk(filters))
  }, [dispatch, filters, data, categories])

  // Clear detail state on unmount so stale results never flash.
  useEffect(() => {
    return () => {
      dispatch(reportAction.resetDetail())
    }
  }, [dispatch])

  const title = useMemo(() => {
    if (filters.category_id) {
      return (
        getCategoryById(filters.category_id, categories)?.name ??
        formatMessage({ id: 'Transactions' })
      )
    }
    if (filters.type === 'income') return formatMessage({ id: 'Income' })
    if (filters.type === 'expense') return formatMessage({ id: 'Expense' })
    return formatMessage({ id: 'Transactions' })
  }, [filters, categories, formatMessage])

  const rangeLabel = useMemo(() => {
    if (filters.date_from && filters.date_to) {
      return `${filters.date_from} - ${filters.date_to}`
    }
    return formatMessage({ id: 'AllTime' })
  }, [filters, formatMessage])

  const { totalIncome, totalExpense } = updateTotal(detailData, categories)
  const count = detailData.reduce(
    (sum, entry) =>
      sum + entry.subdata.reduce((s, sub) => s + sub.item.length, 0),
    0
  )

  return (
    <div className="report-detail">
      <div className="flex-column flex-1 gap-4 p-4">
        <Navbar enableBackButton={true} title="Reports" />

        <ReportDetailInfo
          title={title}
          rangeLabel={rangeLabel}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          count={count}
        />

        {!isDetailLoading && detailData.length === 0 && (
          <div className="flex-justify-center flex-align-center flex-1">
            <span className="text--italic text--light">
              {formatMessage({ id: 'NoTransaction' })}
            </span>
          </div>
        )}

        {scrollParent && detailData.length > 0 && (
          <Virtuoso
            customScrollParent={scrollParent}
            data={detailData}
            computeItemKey={(_, item) => item.date}
            itemContent={(index, item) => (
              <div className="transactions__item">
                {shouldShowMonthHeader(
                  item.date,
                  detailData[index - 1]?.date
                ) && (
                  <span className="transactions__month-header">
                    {formatMessage({ id: formatMonthLabel(item.date) })}
                  </span>
                )}
                <TransactionContainer
                  data={item}
                  index={index}
                  isExpanded={isExpanded(item.date)}
                  onToggle={toggle}
                  selectedTransaction={selectedTransaction}
                  setSelectedTransaction={setSelectedTransaction}
                />
              </div>
            )}
          />
        )}
      </div>
    </div>
  )
}

export default ReportDetail

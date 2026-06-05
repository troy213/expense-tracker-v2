import { useEffect, useMemo, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { Virtuoso } from 'react-virtuoso'
import { useIntl } from 'react-intl'
import { CategoryIcon, Navbar } from '@/components'
import type { LayoutContextType } from '@/components/Layout'
import {
  DEFAULT_EXPANDED_COUNT,
  DEFAULT_VISIBLE_GROUPS,
} from '@/constants/config'
import { useAppDispatch, useAppSelector, useExpandableGroups } from '@/hooks'
import TransactionContainer from '@/pages/Dashboard/Transactions/TransactionContainer'
import { getDBReportDetail } from '@/store/report-detail/report-detail-thunk'
import { reportDetailAction } from '@/store/report-detail/report-detail-slice'
import { TransactionFilters } from '@/types'
import { formatTransactionDate, getCategoryById } from '@/utils'
import ReportDetailInfo from './ReportDetailInfo'
import { SpinnerSvg } from '@/assets'
import './index.scss'

const ReportDetail = () => {
  const { scrollParent } = useOutletContext<LayoutContextType>()
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const { data } = useAppSelector((state) => state.transactionsReducer)
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const {
    data: detailData,
    selectedDetailCategory,
    isLoading: isDetailLoading,
  } = useAppSelector((state) => state.reportDetailReducer)

  const detailCount = detailData.length

  const [selectedTransaction, setSelectedTransaction] = useState('')
  const [showAll, setShowAll] = useState(false)
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
    dispatch(getDBReportDetail(filters))
  }, [dispatch, filters, data, categories])

  // Clear detail state on unmount so stale results never flash.
  useEffect(() => {
    return () => {
      dispatch(reportDetailAction.resetDetail())
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
      return (
        formatTransactionDate(filters.date_from) +
        ' - ' +
        formatTransactionDate(filters.date_to)
      )
    }
    return formatMessage({ id: 'AllTime' })
  }, [filters, formatMessage])

  // Collapse to the first few date groups until the user opts into the full list.
  const hasMore = detailData.length > DEFAULT_VISIBLE_GROUPS
  const visibleData = showAll
    ? detailData
    : detailData.slice(0, DEFAULT_VISIBLE_GROUPS)

  if (isDetailLoading)
    return (
      <div className="report-detail p-4">
        <Navbar enableBackButton={true} title="Reports" />
        <div className="flex-justify-center flex-align-center flex-1">
          <SpinnerSvg className="icon--xl icon--fill-primary spin" />
        </div>
      </div>
    )

  return (
    <div className="report-detail">
      <div className="flex-column flex-1 gap-4 p-4">
        <Navbar enableBackButton={true} title="Reports" />

        <div className="flex-space-between flex-align-center">
          <div className="flex-align-center gap-4">
            {selectedDetailCategory && (
              <CategoryIcon
                iconId={selectedDetailCategory.icon_id}
                color={selectedDetailCategory.color}
                isActive={selectedDetailCategory.is_active}
                height="4rem"
                width="4rem"
                iconClassName="icon--2xl"
              />
            )}
            <div className="flex-column">
              <span className="text--bold">{title}</span>
              <span className="text--light text--3">{rangeLabel}</span>
            </div>
          </div>

          {selectedDetailCategory && !selectedDetailCategory.is_active && (
            <span className="pill pill--default">
              {formatMessage({ id: 'Archived' })}
            </span>
          )}
        </div>

        <ReportDetailInfo />

        <div className="flex-space-between flex-align-center pt-4">
          <div className="flex-column">
            <span className="text--bold">
              {formatMessage({ id: 'RecentTransactions' })}
            </span>
            <span className="text--light text--3">
              {formatMessage(
                { id: 'TransactionCount' },
                { count: detailCount }
              )}
            </span>
          </div>

          {hasMore && (
            <button
              type="button"
              className="btn btn-clear"
              onClick={() => setShowAll((prev) => !prev)}
            >
              <span className="text--3 text--color-primary">
                {formatMessage({ id: showAll ? 'ShowLess' : 'ViewAll' })}
              </span>
            </button>
          )}
        </div>

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
            data={visibleData}
            computeItemKey={(_, item) => item.date}
            itemContent={(index, item) => (
              <div className="transactions__item">
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

        {hasMore && !showAll && (
          <div className="flex-justify-center flex-align-center mb-4">
            <button
              type="button"
              className="btn btn-clear"
              onClick={() => setShowAll((prev) => !prev)}
            >
              <span className="text--italic text--3 text--color-primary">
                {formatMessage(
                  { id: 'SeeMoreTransactions' },
                  { count: detailCount - DEFAULT_VISIBLE_GROUPS }
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportDetail

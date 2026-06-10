import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { CategoryIcon, Navbar } from '@/components'
import Transactions from '@/components/Transactions'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { getDBReportDetail } from '@/store/report-detail/report-detail-thunk'
import { reportDetailAction } from '@/store/report-detail/report-detail-slice'
import { TransactionFilters } from '@/types'
import { formatTransactionDate, getCategoryById } from '@/utils'
import ReportDetailInfo from './ReportDetailInfo'
import { SpinnerSvg } from '@/assets'
import './index.scss'

const ReportDetail = () => {
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

  if (isDetailLoading)
    return (
      <div className="report-detail p-4">
        <Navbar enableBackButton={true} title="Reports" />
        <div className="flex-justify-center flex-align-center flex-1">
          <SpinnerSvg className="icon--xl icon--color-primary spin" />
        </div>
      </div>
    )

  return (
    <div className="report-detail">
      <div className="flex-column gap-4 p-4">
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

        {detailData.length > 0 && <ReportDetailInfo />}
      </div>

      <Transactions data={detailData} />
    </div>
  )
}

export default ReportDetail

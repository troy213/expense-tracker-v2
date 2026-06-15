import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { CategoryIcon, Navbar, Widget } from '@/components'
import { useAppSelector } from '@/hooks'
import { combineClassName, currencyFormatter, ordinal } from '@/utils'
import RecurringHistoryItem from './RecurringHistoryItem'
import RecurringAction from './RecurringAction'
import './index.scss'

const RecurringDetail = () => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const { formatMessage } = useIntl()

  const navigate = useNavigate()

  const data = useAppSelector((s) =>
    s.recurringReducer.recurring.find((d) => d.id === id)
  )
  const category = useAppSelector((s) =>
    s.categoriesReducer.categories.find((c) => data?.category_id === c.id)
  )
  const history = useAppSelector((s) => s.recurringReducer.history)

  // Deleting from the header card removes the data while we're still on
  // its page. Distinguish "just deleted" (data existed earlier this
  // mount → leave) from "never existed" (stale link → not-found state below).
  const hadData = useRef(false)
  useEffect(() => {
    if (data) {
      hadData.current = true
    } else if (hadData.current) {
      navigate('/recurring', { replace: true })
    }
  }, [data, navigate])

  // Pending months on top (oldest first — the catch-up queue), resolved below
  // (newest first).
  const rows = useMemo(() => {
    const own = history.filter((r) => r.recurring_id === id)
    const pending = own
      .filter((r) => r.status === 'pending')
      .sort((a, b) => a.date.localeCompare(b.date))
    const resolved = own
      .filter((r) => r.status !== 'pending')
      .sort((a, b) => b.date.localeCompare(a.date))
    return [...pending, ...resolved]
  }, [history, id])

  const containerClassName = combineClassName(
    'recurring-detail flex-column gap-4 p-4',
    [
      {
        condition: data !== undefined && !data.is_active,
        className: 'recurring-detail--inactive',
      },
    ]
  )

  if (!id || !data) {
    return (
      <div className="recurring-detail flex-column gap-4 p-4">
        <Navbar enableBackButton title="RecurringDetail" />
        <div className="flex-align-center flex-justify-center flex-1">
          <span className="text--light text--3">
            {formatMessage({ id: 'NoRecurringDetail' })}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={containerClassName}>
      <Navbar enableBackButton title="RecurringDetail" />

      <div className="recurring-detail__header">
        {category && (
          <CategoryIcon
            iconId={category.icon_id}
            color={category.color}
            isActive={data.is_active}
          />
        )}
        <div className="flex-column flex-align-center">
          <span>{data.recurring_name}</span>
          {category && (
            <span className="text--light text--3">{category.name}</span>
          )}
        </div>

        <div className="flex-align-center gap-1">
          <span className="text--bold text--6">
            {currencyFormatter(data.amount)}
          </span>
          <span className="text--light text--3">
            {formatMessage({ id: 'PerMonth' })}
          </span>
        </div>
      </div>

      <RecurringAction data={data} />

      <Widget className="flex-none">
        <div className="recurring-detail__info">
          <span className="text--3 text--uppercase">
            {formatMessage({ id: 'RuleDetails' })}
          </span>
          <div className="flex-space-between">
            <div className="flex-1 flex-column gap-1">
              <span className="text--light text--3">
                {formatMessage({ id: 'Frequency' })}
              </span>
              <span className="text--bold text--3">
                {formatMessage({ id: 'Monthly' })}
              </span>
            </div>
            <div className="flex-1 flex-column gap-1">
              <span className="text--light text--3">
                {formatMessage({ id: 'DueDay' })}
              </span>
              <span className="text--bold text--3">
                {ordinal(data.due_day)}
              </span>
            </div>
          </div>
          <div className="flex-space-between">
            <div className="flex-1 flex-column gap-1">
              <span className="text--light text--3">
                {formatMessage({ id: 'StartPeriod' })}
              </span>
              <span className="text--bold text--3">{data.start_period}</span>
            </div>
            <div className="flex-1 flex-column gap-1">
              <span className="text--light text--3">
                {formatMessage({ id: 'ActiveUntil' })}
              </span>
              {data.active_until ? (
                <span className="text--bold text--3">{data.active_until}</span>
              ) : (
                <span className="text--light text--3 text--italic">
                  {formatMessage({ id: 'NoEndDate' })}
                </span>
              )}
            </div>
          </div>
        </div>
      </Widget>

      <div className="flex-1 flex-column gap-4 mt-4">
        <span className="text--bold">{formatMessage({ id: 'History' })}</span>

        {rows.length === 0 && (
          <span className="flex-1 flex-justify-center flex-align-center text--light text--3">
            {formatMessage({ id: 'NoRecurring' })}
          </span>
        )}
        {rows.map((row) => (
          <RecurringHistoryItem
            key={row.id}
            row={row}
            recurringName={data.recurring_name}
          />
        ))}
      </div>
    </div>
  )
}

export default RecurringDetail

import { useIntl } from 'react-intl'
import { useAppSelector } from '@/hooks'
import {
  calculatePercentage,
  combineClassName,
  currencyFormatter,
} from '@/utils'
import { ProgressBar } from '@/components'
import { AlertCircleSvg, AlertTriangleSvg } from '@/assets'

const ReportDetailInfo = () => {
  const { totalIncome, totalExpense, totalBudget, remainingBudget } =
    useAppSelector((state) => state.reportDetailReducer)
  const { formatMessage } = useIntl()

  const hasIncome = totalIncome > 0
  const hasExpense = totalExpense > 0
  const hasBudget = totalBudget > 0
  const percentage = Number(
    (100 - calculatePercentage(remainingBudget, totalBudget)).toFixed(2)
  )
  const progress = Math.min(100, Math.max(0, percentage))
  const isWarning = percentage >= 75 && percentage < 90
  const isDanger = percentage >= 90

  const progressClassName = combineClassName('', [
    {
      condition: isWarning,
      className: 'progress-bar__fill--warning',
    },
    {
      condition: isDanger,
      className: 'progress-bar__fill--danger',
    },
  ])

  const budgetTextClassName = combineClassName('text--light text--3', [
    {
      condition: isWarning,
      className: 'text--color-warning',
    },
    {
      condition: isDanger,
      className: 'text--color-danger',
    },
  ])

  return (
    <div className="report-detail-info">
      <div className="report-detail-info__budget">
        {hasIncome && (
          <div className="flex-column">
            <span className="text--light text--3">
              {formatMessage({ id: 'TotalIncome' })}
            </span>
            <span className="text--bold text--6">
              {currencyFormatter(totalIncome)}
            </span>
          </div>
        )}
        {hasExpense && (
          <div className="flex-space-between flex-align-center">
            <div className="flex-column">
              <span className="text--light text--3">
                {formatMessage({ id: 'TotalExpense' })}
              </span>
              <span className="text--bold text--6">
                {currencyFormatter(totalExpense)}
              </span>
            </div>
            {hasBudget && (
              <div className="flex-column flex-align-end flex-end">
                <span className="text--light text--3">
                  {formatMessage({ id: 'BudgetRp' })}
                </span>
                <span>{currencyFormatter(totalBudget)}</span>
              </div>
            )}
          </div>
        )}
        {hasBudget && (
          <div className="flex-column gap-2">
            <ProgressBar
              amount={progress}
              options={{ enableStyle: false, progressClassName }}
            />
            <div className="flex-space-between">
              <div className="flex-align-center gap-1">
                {isWarning && (
                  <AlertTriangleSvg className="icon--sm icon--stroke-warning" />
                )}
                {isDanger && (
                  <AlertCircleSvg className="icon--sm icon--stroke-danger" />
                )}
                <span className={budgetTextClassName}>
                  {formatMessage(
                    { id: 'BudgetMonthlyUsed' },
                    { budget: percentage }
                  )}
                </span>
              </div>
              <span className={budgetTextClassName}>
                {formatMessage(
                  { id: 'BudgetLeft' },
                  { budget: currencyFormatter(remainingBudget) }
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportDetailInfo

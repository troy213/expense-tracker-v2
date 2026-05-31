import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import {
  ArrowDownSvg,
  ArrowUpSvg,
  EyeSvg,
  EyeOffSvg,
  SlidersSvg,
  HiddenTextSvg,
  AlertTriangleSvg,
  AlertCircleSvg,
} from '@/assets'
import { ProgressBar, Widget } from '@/components'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { configAction } from '@/store/config/config-slice'
import { getDBDashboardInfo } from '@/store/report/report-thunk'
import {
  calculatePercentage,
  combineClassName,
  currencyFormatter,
  formatTransactionDate,
  getCurrentMonthRange,
} from '@/utils'

type BalanceProps = {
  totalBalance: number
}

const DashboardInfo = () => {
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()
  const { data } = useAppSelector((state) => state.transactionsReducer)
  const { hideBalance } = useAppSelector((state) => state.configReducer)
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const { totalIncome, totalExpenses, totalBudget, remainingBudget } =
    useAppSelector((state) => state.reportReducer)

  const totalBalance = totalIncome - totalExpenses
  const { firstDate, lastDate } = getCurrentMonthRange()

  useEffect(() => {
    dispatch(getDBDashboardInfo())
  }, [dispatch, data, categories])

  const budgetPercentage = calculatePercentage(remainingBudget, totalBudget)
  const isWarning = budgetPercentage > 0 && budgetPercentage <= 25
  const isDanger = budgetPercentage <= 0

  const budgetPercentageClassName = combineClassName('text--light text--3', [
    {
      condition: isWarning,
      className: 'text--color-warning',
    },
    { condition: isDanger, className: 'text--color-danger' },
  ])

  const budgetClassName = combineClassName('text--color-primary', [
    {
      condition: remainingBudget < 0,
      className: 'text--color-danger',
    },
  ])

  return (
    <div className="dashboard-info">
      <div className="flex-column flex-align-center gap-2">
        <span className="text--light text--3">
          {formatMessage({ id: 'TotalBalance' })}
        </span>
        <Balance totalBalance={totalBalance} />
      </div>
      {!hideBalance && (
        <div className="flex gap-4">
          <Widget>
            <div className="flex-column flex-align-center gap-1">
              <div className="flex-align-center gap-1">
                <span className="text--light text--3">
                  {formatMessage({ id: 'TotalIncome' })}
                </span>
                <ArrowUpSvg className="icon--sm icon--stroke-success" />
              </div>
              <span>{currencyFormatter(totalIncome)}</span>
            </div>
          </Widget>
          <Widget>
            <div className="flex-column flex-align-center gap-1">
              <div className="flex-align-center gap-1">
                <span className="text--light text--3">
                  {formatMessage({ id: 'TotalExpense' })}
                </span>
                <ArrowDownSvg className="icon--sm icon--stroke-danger" />
              </div>
              <span>{currencyFormatter(totalExpenses)}</span>
            </div>
          </Widget>
        </div>
      )}
      <Widget>
        <div className="flex-column gap-2">
          <div className="flex-space-between flex-align-center">
            <div className="flex-column gap-1">
              <span className="text--light text--3">
                {formatMessage({ id: 'TotalRemainingBudget' })}
              </span>
              <span className={budgetClassName}>
                {currencyFormatter(remainingBudget ?? 0)}
              </span>
            </div>
            <Link to="/categories?cat=expense">
              <SlidersSvg className="icon--stroke-primary" />
            </Link>
          </div>

          <ProgressBar amount={budgetPercentage < 0 ? 0 : budgetPercentage} />

          <div className="flex-space-between">
            <span className="text--italic text--light text--3">
              {`${formatTransactionDate(firstDate)} - ${formatTransactionDate(lastDate)}`}
            </span>
            <div className="flex-align-center gap-1">
              {isWarning && (
                <AlertTriangleSvg className="icon--sm icon--stroke-warning" />
              )}
              {isDanger && (
                <AlertCircleSvg className="icon--sm icon--stroke-danger" />
              )}
              <span className={budgetPercentageClassName}>
                {budgetPercentage}%
              </span>
            </div>
          </div>
        </div>
      </Widget>
    </div>
  )
}

const Balance: React.FC<BalanceProps> = ({ totalBalance }) => {
  const { hideBalance } = useAppSelector((state) => state.configReducer)
  const dispatch = useAppDispatch()

  const handleHideBalance = () => {
    dispatch(configAction.toggleHideBalance())
  }

  return (
    <div className="flex-align-center gap-2">
      <button
        className="btn btn-clear"
        type="button"
        onClick={handleHideBalance}
      >
        {hideBalance ? (
          <EyeOffSvg className="icon--stroke-white" />
        ) : (
          <EyeSvg className="icon--stroke-white" />
        )}
      </button>
      {hideBalance ? (
        <HiddenTextSvg className="icon--stroke-white icon--fill-white" />
      ) : (
        <span className="text--bold text--8">
          {currencyFormatter(totalBalance)}
        </span>
      )}
    </div>
  )
}

export default DashboardInfo

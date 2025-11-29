import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import {
  ArrowDownSvg,
  ArrowUpSvg,
  EyeSvg,
  EyeOffSvg,
  SlidersSvg,
  HiddenTextSvg,
} from '@/assets'
import { ProgressBar, Widget } from '@/components'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { mainAction } from '@/store/main/main-slice'
import {
  calculatePercentage,
  calculateRemainingBudget,
  combineClassName,
  currencyFormatter,
  formatTransactionDate,
  getCurrentMonthRange,
  updateTotal,
} from '@/utils'

type BalanceProps = {
  totalBalance: number
}

const DashboardInfo = () => {
  const { formatMessage } = useIntl()
  const { data } = useAppSelector((state) => state.mainReducer)
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const { totalIncome, totalExpense, totalBalance } = updateTotal(data)
  const { firstDate, lastDate } = getCurrentMonthRange()

  const expenseCategories = useMemo(() => {
    return categories.filter((c) => c.type === 'expense').map((c) => c.name)
  }, [categories])

  const totalBudget = useMemo(() => {
    return categories
      .filter((c) => c.type === 'expense')
      .reduce((acc, curr) => acc + (curr.budget ?? 0), 0)
  }, [categories])

  const remainingBudget = useMemo(() => {
    return calculateRemainingBudget(data, [], expenseCategories, totalBudget)
  }, [data, expenseCategories, totalBudget])

  const budgetPercentage = calculatePercentage(remainingBudget, totalBudget)

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
            <span>{currencyFormatter(totalExpense)}</span>
          </div>
        </Widget>
      </div>
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
            <span className="text--light text--3">{budgetPercentage}%</span>
          </div>
        </div>
      </Widget>
    </div>
  )
}

const Balance: React.FC<BalanceProps> = ({ totalBalance }) => {
  const { hideBalance } = useAppSelector((state) => state.mainReducer)
  const dispatch = useAppDispatch()

  const handleHideBalance = () => {
    dispatch(mainAction.setState({ state: 'hideBalance', value: !hideBalance }))
  }

  if (hideBalance)
    return (
      <div className="flex-align-center gap-2">
        <button
          className="btn btn-clear"
          type="button"
          onClick={handleHideBalance}
        >
          <EyeOffSvg className="icon--stroke-white" />
        </button>
        <HiddenTextSvg className="icon--stroke-white icon--fill-white" />
      </div>
    )

  return (
    <div className="flex-align-center gap-2">
      <button
        className="btn btn-clear"
        type="button"
        onClick={handleHideBalance}
      >
        <EyeSvg className="icon--stroke-white" />
      </button>
      <span className="text--bold text--8">
        {currencyFormatter(totalBalance)}
      </span>
    </div>
  )
}

export default DashboardInfo

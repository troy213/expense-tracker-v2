import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { ArrowDownSvg, ArrowUpSvg, SlidersSvg } from '@/assets'
import { ProgressBar, Widget } from '@/components'
import { useAppSelector } from '@/hooks'
import {
  calculatePercentage,
  calculateRemainingBudget,
  combineClassName,
  currencyFormatter,
  formatTransactionDate,
  getCurrentMonthRange,
  updateTotal,
} from '@/utils'

const DashboardInfo = () => {
  const { formatMessage } = useIntl()
  const { data } = useAppSelector((state) => state.mainReducer)
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const { totalIncome, totalExpense, totalBalance } = updateTotal(data)
  const { firstDate, lastDate } = getCurrentMonthRange()

  const expenseCategories = categories
    .filter((category) => category.type === 'expense')
    .map((category) => category.name)
  const totalBudget = categories
    .filter((category) => category.type === 'expense')
    .reduce((acc, curr) => acc + (curr.budget ?? 0), 0)

  const remainingBudget = useMemo(
    () => calculateRemainingBudget(data, [], expenseCategories, totalBudget),
    [data, expenseCategories, totalBudget]
  )

  const budgetPercentage = calculatePercentage(remainingBudget, totalBudget)

  const budgetClassName = combineClassName('text--color-primary', [
    {
      condition: remainingBudget < 0,
      className: 'text--color-danger',
    },
  ])

  return (
    <div className="dashboard-info">
      <div className="flex-column flex-align-center">
        <span className="text--light text--3">
          {formatMessage({ id: 'TotalBalance' })}
        </span>
        <span className="text--bold text--8">
          {currencyFormatter(totalBalance)}
        </span>
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
            <Link to="/categories">
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

export default DashboardInfo

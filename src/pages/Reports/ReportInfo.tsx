import { useIntl } from 'react-intl'
import { combineClassName, currencyFormatter } from '@/utils'
import { Widget } from '@/components'
import { CATEGORY_ICONS_MAP } from '@/assets/categories-icons'

type ReportInfoProps = {
  totalIncome: number
  totalExpense: number
  totalBalance: number
  avgExpense: number
}
const ReportInfo: React.FC<ReportInfoProps> = ({
  totalIncome,
  totalExpense,
  totalBalance,
  avgExpense,
}) => {
  const { formatMessage } = useIntl()

  const IconComponent = CATEGORY_ICONS_MAP['expense']

  const totalBalanceClassName = combineClassName('text--bold text--8', [
    {
      condition: totalBalance < 0,
      className: 'text--color-danger',
    },
  ])

  return (
    <div className="report-info">
      <div className="flex gap-4">
        <Widget>
          <div className="flex-column flex-align-center flex-1">
            <span className="text--light text--3">
              {formatMessage({ id: 'TotalIncome' })}
            </span>
            <span className="text--bold">{currencyFormatter(totalIncome)}</span>
          </div>
        </Widget>
        <Widget>
          <div className="flex-column flex-align-center flex-1">
            <span className="text--light text--3">
              {formatMessage({ id: 'TotalExpense' })}
            </span>
            <span className="text--bold">
              {currencyFormatter(totalExpense)}
            </span>
          </div>
        </Widget>
      </div>
      <Widget>
        <div className="flex-column flex-align-center">
          <span className="text--light text--3">
            {formatMessage({ id: 'TotalDifference' })}
          </span>
          <span className={totalBalanceClassName}>
            {currencyFormatter(totalBalance)}
          </span>
        </div>
      </Widget>
      <Widget className="bg-primary-2 text--color-white p-3">
        <div className="flex-justify-center flex-align-center gap-4">
          <IconComponent className="report-info__avg-spending-icon" />
          <div className="flex-column">
            <span className="text--light text--3">
              {formatMessage({ id: 'AvgSpending' })}
            </span>
            <span className="text--bold">
              {currencyFormatter(avgExpense)}
              {formatMessage({ id: 'PerDay' })}
            </span>
          </div>
        </div>
      </Widget>
    </div>
  )
}

export default ReportInfo

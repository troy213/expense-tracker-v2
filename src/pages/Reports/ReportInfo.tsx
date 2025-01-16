import { useIntl } from 'react-intl'
import { currencyFormatter } from '@/utils'

type ReportInfoProps = {
  firstDate: string | null
  lastDate: string | null
  totalIncome: number
  totalExpense: number
  totalBalance: number
  avgExpense: number
}
const ReportInfo: React.FC<ReportInfoProps> = ({
  firstDate,
  lastDate,
  totalIncome,
  totalExpense,
  totalBalance,
  avgExpense,
}) => {
  const { formatMessage } = useIntl()

  return (
    <div className="report-info">
      <span className="text--light text--3">
        {firstDate && lastDate
          ? `${firstDate} - ${lastDate}`
          : formatMessage({ id: 'AllTime' })}
      </span>
      <div className="flex-space-between">
        <span>{formatMessage({ id: 'TotalIncome' })}</span>
        <span>{currencyFormatter(totalIncome)}</span>
      </div>
      <div className="flex-space-between">
        <span>{formatMessage({ id: 'TotalExpense' })}</span>
        <span>{currencyFormatter(totalExpense)}</span>
      </div>
      <div className="flex-space-between">
        <span>{formatMessage({ id: 'TotalDifference' })}</span>
        <span>{currencyFormatter(totalBalance)}</span>
      </div>
      <div className="flex-space-between">
        <span>{formatMessage({ id: 'AvgSpending' })}</span>
        <span>{currencyFormatter(avgExpense)}</span>
      </div>
    </div>
  )
}

export default ReportInfo

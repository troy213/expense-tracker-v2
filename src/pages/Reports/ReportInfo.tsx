import { currencyFormatter, formatTransactionDate } from '@/utils'

type ReportInfoProps = {
  firstDate: string
  lastDate: string
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
  return (
    <div className="report-info">
      <span className="text--light text--3">{`${formatTransactionDate(firstDate)} - ${formatTransactionDate(lastDate)}`}</span>
      <div className="flex-space-between">
        <span>Total Income</span>
        <span>{currencyFormatter(totalIncome)}</span>
      </div>
      <div className="flex-space-between">
        <span>Total Expense</span>
        <span>{currencyFormatter(totalExpense)}</span>
      </div>
      <div className="flex-space-between">
        <span>Total Difference</span>
        <span>{currencyFormatter(totalBalance)}</span>
      </div>
      <div className="flex-space-between">
        <span>Avg. Spending</span>
        <span>{currencyFormatter(avgExpense)}</span>
      </div>
    </div>
  )
}

export default ReportInfo

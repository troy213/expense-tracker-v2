import { useIntl } from 'react-intl'
import { currencyFormatter } from '@/utils'

type ReportDetailInfoProps = {
  title: string
  rangeLabel: string
  totalIncome: number
  totalExpense: number
  count: number
}

const ReportDetailInfo: React.FC<ReportDetailInfoProps> = ({
  title,
  rangeLabel,
  totalIncome,
  totalExpense,
  count,
}) => {
  const { formatMessage } = useIntl()

  return (
    <div className="report-detail-info">
      <span className="text--bold">{title}</span>
      <span className="text--light text--3">{rangeLabel}</span>
      <div className="flex-space-between">
        <span>{formatMessage({ id: 'TotalIncome' })}</span>
        <span>{currencyFormatter(totalIncome)}</span>
      </div>
      <div className="flex-space-between">
        <span>{formatMessage({ id: 'TotalExpense' })}</span>
        <span>{currencyFormatter(totalExpense)}</span>
      </div>
      <span className="text--light text--3">
        {formatMessage({ id: 'TransactionCount' }, { count })}
      </span>
    </div>
  )
}

export default ReportDetailInfo

import { useIntl } from 'react-intl'
import { currencyFormatter } from '@/utils'

type ReportDetailInfoProps = {
  totalIncome: number
  totalExpense: number
}

const ReportDetailInfo: React.FC<ReportDetailInfoProps> = ({
  totalIncome,
  totalExpense,
}) => {
  const { formatMessage } = useIntl()

  return (
    <div className="report-detail-info">
      {totalIncome > 0 && (
        <div className="flex-column">
          <span className="text--light text--3">
            {formatMessage({ id: 'TotalIncome' })}
          </span>
          <span className="text--bold text--6">
            {currencyFormatter(totalIncome)}
          </span>
        </div>
      )}
      {totalExpense > 0 && (
        <div className="flex-column">
          <span className="text--light text--3">
            {formatMessage({ id: 'TotalExpense' })}
          </span>
          <span className="text--bold text--6">
            {currencyFormatter(totalExpense)}
          </span>
        </div>
      )}
    </div>
  )
}

export default ReportDetailInfo

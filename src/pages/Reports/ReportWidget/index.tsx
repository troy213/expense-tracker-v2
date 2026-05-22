import { useIntl } from 'react-intl'
import ReportCategory from './ReportCategory'
import { Category, ReportCategory as TReportCategory } from '@/types'

type ReportWidgetProps = {
  type: 'income' | 'expense'
  report: TReportCategory[]
  typeTotal: number
}

const ReportWidget: React.FC<ReportWidgetProps> = ({
  type,
  report,
  typeTotal,
}) => {
  const { formatMessage } = useIntl()

  const getTitle = () => {
    if (type === 'income') {
      return formatMessage({ id: 'TopIncome' })
    } else {
      return formatMessage({ id: 'TopExpense' })
    }
  }

  return (
    <div key={type} className="report-widget">
      <span>{getTitle()}</span>
      {report.map((cat, idx) => {
        return (
          <ReportCategory
            key={idx}
            cat={cat as Category & { total: number }}
            typeTotal={typeTotal}
          />
        )
      })}
    </div>
  )
}

export default ReportWidget

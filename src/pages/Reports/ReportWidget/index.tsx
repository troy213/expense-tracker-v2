import { useIntl } from 'react-intl'
import ReportCategory from './ReportCategory'

type Report = {
  category: string
  total: number
}

type ReportWidgetProps = {
  type: 'income' | 'expense'
  report: Report[]
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
        return <ReportCategory key={idx} cat={cat} typeTotal={typeTotal} />
      })}
    </div>
  )
}

export default ReportWidget

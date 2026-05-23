import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import ReportCategory from './ReportCategory'
import { ReportCategory as TReportCategory } from '@/types'
import { buildReportDetailQuery } from '@/utils'

type ReportWidgetProps = {
  type: 'income' | 'expense'
  report: TReportCategory[]
  typeTotal: number
  dateFrom: string | null
  dateTo: string | null
}

const ReportWidget: React.FC<ReportWidgetProps> = ({
  type,
  report,
  typeTotal,
  dateFrom,
  dateTo,
}) => {
  const { formatMessage } = useIntl()
  const navigate = useNavigate()

  const getTitle = () =>
    type === 'income'
      ? formatMessage({ id: 'TopIncome' })
      : formatMessage({ id: 'TopExpense' })

  const handleWidgetClick = () => {
    const query = buildReportDetailQuery({ type, dateFrom, dateTo })
    navigate(`/report-detail?${query}`)
  }

  const handleCategoryClick = (e: React.MouseEvent, cat: TReportCategory) => {
    e.stopPropagation()
    const query = buildReportDetailQuery({
      categoryId: cat.id,
      dateFrom,
      dateTo,
    })
    navigate(`/report-detail?${query}`)
  }

  return (
    <div key={type} className="report-widget">
      <button
        type="button"
        className="btn btn-clear report-widget__title"
        onClick={handleWidgetClick}
      >
        {getTitle()}
      </button>
      {report.map((cat) => (
        <ReportCategory
          key={cat.id}
          cat={cat}
          typeTotal={typeTotal}
          onClick={(e) => handleCategoryClick(e, cat)}
        />
      ))}
    </div>
  )
}

export default ReportWidget

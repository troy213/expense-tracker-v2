import { ProgressBar } from '@/components'
import { calculatePercentage, currencyFormatter } from '@/utils'
import { Link } from 'react-router-dom'
type Report = {
  category: string
  total: number
}

type ReportCategoryProps = {
  cat: Report
  typeTotal: number
  startDate: Date | null
  endDate: Date | null
}

const ReportCategory: React.FC<ReportCategoryProps> = ({
  cat,
  typeTotal,
  startDate,
  endDate,
}) => {
  const percentage = calculatePercentage(cat.total, typeTotal)

  return (
    <Link
      to={`/?category=${cat.category}&from=${startDate?.toLocaleString('en-CA').split(',')[0]}&to=${endDate?.toLocaleString('en-CA').split(',')[0]}`}
      className="link"
    >
      <div className="report-category">
        <span>{cat.category}</span>
        <ProgressBar amount={percentage} />
        <div className="flex-space-between">
          <span className="text--light text--3">
            {currencyFormatter(cat.total)}
          </span>
          <span className="text--light text--3">{percentage}%</span>
        </div>
      </div>
    </Link>
  )
}

export default ReportCategory

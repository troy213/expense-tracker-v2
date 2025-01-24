import { ProgressBar } from '@/components'
import { calculatePercentage, currencyFormatter } from '@/utils'
type Report = {
  category: string
  total: number
}

type ReportCategoryProps = {
  cat: Report
  typeTotal: number
}

const ReportCategory: React.FC<ReportCategoryProps> = ({ cat, typeTotal }) => {
  const percentage = calculatePercentage(cat.total, typeTotal)

  return (
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
  )
}

export default ReportCategory

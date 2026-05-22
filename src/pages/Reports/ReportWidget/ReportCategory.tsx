import { CategoryIcon, ProgressBar } from '@/components'
import { ReportCategory as TReportCategory } from '@/types'
import { calculatePercentage, currencyFormatter } from '@/utils'

type ReportCategoryProps = {
  cat: TReportCategory
  typeTotal: number
}

const ReportCategory: React.FC<ReportCategoryProps> = ({ cat, typeTotal }) => {
  const percentage = calculatePercentage(cat.total, typeTotal)

  return (
    <div className="report-category">
      <CategoryIcon iconId={cat.icon_id} color={cat.color} />
      <div className="flex-column flex-1 gap-2">
        <span>{cat.name}</span>
        <ProgressBar amount={percentage} options={{ enableStyle: false }} />
        <div className="flex-space-between">
          <span className="text--light text--3">
            {currencyFormatter(cat.total)}
          </span>
          <span className="text--light text--3">{percentage}%</span>
        </div>
      </div>
    </div>
  )
}

export default ReportCategory

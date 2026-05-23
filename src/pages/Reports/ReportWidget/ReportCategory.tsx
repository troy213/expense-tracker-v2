import { CategoryIcon, ProgressBar } from '@/components'
import { ReportCategory as TReportCategory } from '@/types'
import { calculatePercentage, currencyFormatter } from '@/utils'

type ReportCategoryProps = {
  cat: TReportCategory
  typeTotal: number
  onClick?: (e: React.MouseEvent, cat: TReportCategory) => void
}

const ReportCategory: React.FC<ReportCategoryProps> = ({
  cat,
  typeTotal,
  onClick,
}) => {
  const percentage = calculatePercentage(cat.total, typeTotal)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e, cat)
  }

  return (
    <button type="button" className="report-category" onClick={handleClick}>
      <CategoryIcon iconId={cat.icon_id} color={cat.color} />
      <div className="flex-column flex-1 gap-2">
        <span className="text--4">{cat.name}</span>
        <ProgressBar amount={percentage} options={{ enableStyle: false }} />
        <div className="flex-space-between">
          <span className="text--light text--3">
            {currencyFormatter(cat.total)}
          </span>
          <span className="text--light text--3">{percentage}%</span>
        </div>
      </div>
    </button>
  )
}

export default ReportCategory

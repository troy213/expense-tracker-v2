import { ProgressBar } from '@/components'

const ReportCategory = () => {
  return (
    <div className="report-category">
      <span>Salary</span>
      <ProgressBar amount={70} />
      <div className="flex-space-between">
        <span className="text--light text--3">Rp7.000.000</span>
        <span className="text--light text--3">70%</span>
      </div>
    </div>
  )
}

export default ReportCategory

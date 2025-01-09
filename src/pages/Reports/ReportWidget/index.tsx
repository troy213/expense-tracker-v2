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
  return (
    <div key={type} className="report-widget">
      <span>Top {type}</span>
      {report.map((cat, idx) => {
        return <ReportCategory key={idx} cat={cat} typeTotal={typeTotal} />
      })}

      {/* All Category Report data will be looped here */}
      {/* <ReportCategory />
      <ReportCategory />
      <ReportCategory />
      <ReportCategory /> */}
    </div>
  )
}

export default ReportWidget

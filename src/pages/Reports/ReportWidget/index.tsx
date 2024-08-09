import ReportCategory from './ReportCategory'

type ReportWidgetProps = {
  type: 'income' | 'outcome'
}

const ReportWidget: React.FC<ReportWidgetProps> = ({ type }) => {
  return (
    <div className="report-widget">
      <span>Top {type}</span>

      {/* All Category Report data will be looped here */}
      <ReportCategory />
      <ReportCategory />
      <ReportCategory />
      <ReportCategory />
    </div>
  )
}

export default ReportWidget

import { ProgressBar } from '@/components'
import { useIntl } from 'react-intl'

const ReportCategory = () => {
  const { formatMessage } = useIntl()

  return (
    <div className="report-category">
      <span>{formatMessage({ id: 'Salary' })}</span>
      <ProgressBar amount={70} />
      <div className="flex-space-between">
        <span className="text--light text--3">Rp7.000.000</span>
        <span className="text--light text--3">70%</span>
      </div>
    </div>
  )
}

export default ReportCategory

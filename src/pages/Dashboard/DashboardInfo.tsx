import { ArrowDownSvg, ArrowUpSvg, SlidersSvg } from '@/assets'
import { ProgressBar, Widget } from '@/components'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

const DashboardInfo = () => {
  const { formatMessage } = useIntl()

  return (
    <div className="dashboard-info">
      <div className="flex-column flex-align-center">
        <span className="text--light text--3">
          {formatMessage({ id: 'TotalBalance' })}
        </span>
        <span className="text--bold text--8">Rp1.234.567</span>
      </div>
      <div className="flex gap-4">
        <Widget>
          <div className="flex-column flex-align-center gap-1">
            <div className="flex-align-center gap-1">
              <span className="text--light text--3">
                {formatMessage({ id: 'TotalIncome' })}
              </span>
              <ArrowUpSvg className="icon--sm icon--stroke-success" />
            </div>
            <span>Rp1.234.567</span>
          </div>
        </Widget>
        <Widget>
          <div className="flex-column flex-align-center gap-1">
            <div className="flex-align-center gap-1">
              <span className="text--light text--3">
                {formatMessage({ id: 'TotalOutcome' })}
              </span>
              <ArrowDownSvg className="icon--sm icon--stroke-danger" />
            </div>
            <span>Rp1.234.567</span>
          </div>
        </Widget>
      </div>
      <Widget>
        <div className="flex-column gap-2">
          <div className="flex-space-between flex-align-center">
            <div className="flex-column gap-1">
              <span className="text--light text--3">
                {formatMessage({ id: 'TotalRemainingBudget' })}
              </span>
              <span>Rp1.234.567</span>
            </div>
            <Link to="/categories">
              <SlidersSvg className="icon--stroke-primary" />
            </Link>
          </div>

          <ProgressBar amount={95} />

          <div className="flex-space-between">
            <span className="text--italic text--light text--3">
              1 Apr 2024 - 30 Apr 2024
            </span>
            <span className="text--light text--3">95%</span>
          </div>
        </div>
      </Widget>
    </div>
  )
}

export default DashboardInfo

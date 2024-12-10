import { MoreVerticalSvg } from '@/assets'
import { Navbar, Toolbar } from '@/components'
import ReportInfo from './ReportInfo'
import ReportWidget from './ReportWidget'

const Reports = () => {
  return (
    <div className="reports">
      <div className="flex-column gap-4 p-4">
        <Navbar enableBackButton={true} title="Reports">
          <button type="button" className="btn btn-clear">
            <MoreVerticalSvg className="icon--stroke-primary" />
          </button>
        </Navbar>

        <ReportInfo />

        <ReportWidget type="income" />
        <ReportWidget type="expense" />
      </div>
      <Toolbar />
    </div>
  )
}

export default Reports

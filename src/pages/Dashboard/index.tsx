import { Navbar, Toolbar } from '@/components'
import DashboardInfo from './DashboardInfo'
import Transactions from './Transactions'
import { SearchSvg } from '@/assets'

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <Navbar title="Dashboard">
          <button className="btn btn-clear">
            <SearchSvg className="icon--stroke-white" />
          </button>
        </Navbar>
        <DashboardInfo />
      </div>

      <Transactions />
      <Toolbar />
    </div>
  )
}

export default Dashboard

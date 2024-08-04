import { Navbar, Toolbar } from '@/components'
import DashboardInfo from './DashboardInfo'
import Transactions from './Transactions'
import { SearchSvg } from '@/assets'

const Dashboard = () => {
  return (
    <div className='dashboard flex-column flex-space-between'>
      <div className='dashboard__container flex-column gap-4'>
        <Navbar>
          <div className='flex-space-between flex-align-center'>
            <span>Dashboard</span>
            <button className='btn btn-clear'>
              <SearchSvg className='icon--stroke-white' />
            </button>
          </div>
        </Navbar>
        <DashboardInfo />
      </div>

      <Transactions />
      <Toolbar />
    </div>
  )
}

export default Dashboard

import { Navbar, Toolbar } from '@/components'
import DashboardInfo from './DashboardInfo'
import Transactions from './Transactions'
import { SearchSvg } from '@/assets'

interface ThemeProps {
  theme: string
}

const Dashboard: React.FC<ThemeProps> = ({ theme }) => {
  return (
    <div className={`dashboard ${theme === 'dark' ? 'dark' : ''}`}>
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

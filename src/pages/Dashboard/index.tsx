import { SearchSvg } from '@/assets'
import { Navbar } from '@/components'
import { useDisclosure } from '@/hooks'
import SearchModal from '@/components/Modal/SearchModal'
import DashboardInfo from './DashboardInfo'
import Transactions from './Transactions'
import './index.scss'

const Dashboard = () => {
  const searchModal = useDisclosure()

  return (
    <div className="dashboard">
      {searchModal.isOpen && (
        <SearchModal isOpen={searchModal.isOpen} onClose={searchModal.close} />
      )}
      <div className="dashboard__container">
        <Navbar title="Dashboard">
          <button className="btn btn-clear" onClick={searchModal.toggle}>
            <SearchSvg className="icon--stroke-white" />
          </button>
        </Navbar>
        <DashboardInfo />
      </div>

      <Transactions />
    </div>
  )
}

export default Dashboard

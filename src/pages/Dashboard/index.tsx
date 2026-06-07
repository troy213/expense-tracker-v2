import { useIntl } from 'react-intl'
import { SearchSvg } from '@/assets'
import { Navbar } from '@/components'
import { useAppSelector, useDisclosure } from '@/hooks'
import SearchModal from '@/components/Modal/SearchModal'
import DashboardInfo from './DashboardInfo'
import DashboardLauncher from './DashboardLauncher'
import Transactions from '@/components/Transactions'
import './index.scss'

const Dashboard = () => {
  const searchModal = useDisclosure()
  const { formatMessage } = useIntl()
  const { data, isLoading } = useAppSelector((s) => s.transactionsReducer)

  return (
    <div className="dashboard">
      {searchModal.isOpen && (
        <SearchModal isOpen={searchModal.isOpen} onClose={searchModal.close} />
      )}
      <div className="dashboard__container">
        <Navbar title="Dashboard">
          <button
            className="btn btn-clear"
            onClick={searchModal.toggle}
            aria-label={formatMessage({ id: 'Search' })}
          >
            <SearchSvg className="icon--color-white" />
          </button>
        </Navbar>
        <DashboardInfo />
        <DashboardLauncher />
      </div>

      <Transactions data={data} isLoading={isLoading} showMonthHeaders />
    </div>
  )
}

export default Dashboard

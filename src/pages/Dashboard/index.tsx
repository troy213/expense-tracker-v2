import { useState } from 'react'
import { SearchSvg } from '@/assets'
import { Navbar, Toolbar } from '@/components'
import SearchModal from '@/components/Modal/SearchModal'
import DashboardInfo from './DashboardInfo'
import Transactions from './Transactions'

const Dashboard = () => {
  const [searchModalIsOpen, setSearchModalIsOpen] = useState(false)

  const handleOpenModal = () => {
    setSearchModalIsOpen((prevState) => !prevState)
  }

  return (
    <div className="dashboard">
      {searchModalIsOpen && (
        <SearchModal
          isOpen={searchModalIsOpen}
          setIsOpen={setSearchModalIsOpen}
        />
      )}
      <div className="dashboard__container">
        <Navbar title="Dashboard">
          <button className="btn btn-clear" onClick={handleOpenModal}>
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

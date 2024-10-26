import { useState } from 'react'
import { dummyTransactions } from '@/dummy/dummy-transactions'
import TransactionDetail from './TransactionDetail'

const Transactions = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<string>('')

  const handleSelectedTransaction = (id: string) => {
    if (selectedTransaction && selectedTransaction === id)
      return setSelectedTransaction('')
    setSelectedTransaction(id)
  }

  // temporary using dummy data
  if (!dummyTransactions.length)
    return (
      <div className="transactions">
        <div className="flex-justify-center flex-align-center h-100">
          <span className="text--italic text--light">
            There is no transaction
          </span>
        </div>
      </div>
    )

  // temporary using dummy data
  return (
    <div className="transactions">
      {dummyTransactions.map((item) => {
        return (
          <TransactionDetail
            data={item}
            key={item.id}
            selectedTransaction={selectedTransaction}
            handleSelectTransaction={handleSelectedTransaction}
          />
        )
      })}
    </div>
  )
}

export default Transactions

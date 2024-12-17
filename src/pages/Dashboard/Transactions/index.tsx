import { useState } from 'react'
import TransactionDetail from './TransactionDetail'
import { useAppSelector } from '@/hooks'

const Transactions = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<string>('')
  const { data } = useAppSelector((state) => state.mainReducer)

  const handleSelectedTransaction = (id: string) => {
    if (selectedTransaction && selectedTransaction === id)
      return setSelectedTransaction('')
    setSelectedTransaction(id)
  }

  if (!data.length)
    return (
      <div className="transactions">
        <div className="flex-justify-center flex-align-center h-100">
          <span className="text--italic text--light">
            There is no transaction
          </span>
        </div>
      </div>
    )

  return (
    <div className="transactions">
      {data.map((item) => {
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

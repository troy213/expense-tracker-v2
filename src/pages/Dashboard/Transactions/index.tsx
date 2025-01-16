import { useState } from 'react'
import { useAppSelector } from '@/hooks'
import { formatTransactionDate } from '@/utils'
import TransactionDetail from './TransactionDetail'

const Transactions = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<string>('')
  const { data } = useAppSelector((state) => state.mainReducer)

  const handleSelectTransaction = (id: string) => {
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
      {data.map((item, index) => {
        const { id, date, subdata } = item
        return (
          <div className="transactions__transaction-detail-container" key={id}>
            <span className="text--italic text--light text--3">
              {formatTransactionDate(date, { enableTodayFormat: true })}
            </span>

            {subdata.map((subitem, subdataIndex) => {
              return (
                <TransactionDetail
                  data={subitem}
                  dataIndex={index}
                  subdataIndex={subdataIndex}
                  selectedTransaction={selectedTransaction}
                  handleSelectTransaction={handleSelectTransaction}
                  key={subitem.id}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default Transactions

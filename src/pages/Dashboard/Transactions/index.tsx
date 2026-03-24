import { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useAppSelector } from '@/hooks'
import SearchResult from './SearchResult'
import TransactionContainer from './TransactionContainer'

type TransactionsProps = {
  displayCount: number
}

const Transactions = ({ displayCount }: TransactionsProps) => {
  const { data } = useAppSelector((state) => state.mainReducer)
  const [selectedTransaction, setSelectedTransaction] = useState('')
  const { formatMessage } = useIntl()

  // Reset selected transaction when data changes
  useEffect(() => {
    setSelectedTransaction('')
  }, [data.length])

  const displayedData = data.slice(0, displayCount)

  if (!data.length)
    return (
      <div className="transactions">
        <SearchResult />

        <div className="flex-justify-center flex-align-center h-100">
          <span className="text--italic text--light">
            {formatMessage({ id: 'NoTransaction' })}
          </span>
        </div>
      </div>
    )

  return (
    <div className="transactions">
      <SearchResult />

      {displayedData.map((item, index) => {
        return (
          <TransactionContainer
            data={item}
            index={index}
            key={item.date}
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
          />
        )
      })}
    </div>
  )
}

export default Transactions

import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useAppSelector } from '@/hooks'
import SearchResult from './SearchResult'
import TransactionContainer from './TransactionContainer'

const Transactions = () => {
  const { data } = useAppSelector((state) => state.mainReducer)
  const [selectedTransaction, setSelectedTransaction] = useState('')
  const { formatMessage } = useIntl()

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

      {data.map((item, index) => {
        return (
          <TransactionContainer
            data={item}
            index={index}
            key={item.id}
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
          />
        )
      })}
    </div>
  )
}

export default Transactions

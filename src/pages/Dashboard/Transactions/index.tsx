import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useAppSelector } from '@/hooks'
import SearchResult from './SearchResult'
import TransactionContainer from './TransactionContainer'
import { filterDataByCategory } from '@/utils'
import { useLocation } from 'react-router-dom'

const Transactions = () => {
  const { data } = useAppSelector((state) => state.mainReducer)
  const [selectedTransaction, setSelectedTransaction] = useState('')
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const categoryParam = query.get('category')
  const fromParam = query.get('from')
  const toParam = query.get('to')
  const filteredData = filterDataByCategory(
    data,
    categoryParam,
    fromParam,
    toParam
  )
  const displayData = filteredData.length > 0 ? filteredData : data
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

      {displayData.map((item, index) => {
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

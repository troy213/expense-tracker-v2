import { useState, useRef, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { INITIAL_LOAD, LOAD_MORE_COUNT } from '@/constants/config'
import { useAppSelector } from '@/hooks'
import SearchResult from './SearchResult'
import TransactionContainer from './TransactionContainer'

const Transactions = () => {
  const { data } = useAppSelector((state) => state.mainReducer)
  const [selectedTransaction, setSelectedTransaction] = useState('')
  const [displayCount, setDisplayCount] = useState(INITIAL_LOAD)
  const transactionsRef = useRef<HTMLDivElement>(null)
  const { formatMessage } = useIntl()

  // Handle scroll event for infinite scroll
  useEffect(() => {
    const container = transactionsRef.current
    if (!container) return

    const handleScroll = () => {
      // Check if user has scrolled near bottom
      const { scrollTop, scrollHeight, clientHeight } = container
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight

      // Load more when user is 300px from bottom
      if (distanceFromBottom < 300 && displayCount < data.length) {
        setDisplayCount((prev) => Math.min(prev + LOAD_MORE_COUNT, data.length))
      }
    }

    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [displayCount, data.length])

  // Reset display count when data changes
  useEffect(() => {
    setDisplayCount(INITIAL_LOAD)
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
    <div className="transactions" ref={transactionsRef}>
      <SearchResult />

      {displayedData.map((item, index) => {
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

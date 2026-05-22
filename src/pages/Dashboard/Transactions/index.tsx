import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Virtuoso } from 'react-virtuoso'
import { useAppSelector, useExpandableGroups } from '@/hooks'
import SearchResult from './SearchResult'
import TransactionContainer from './TransactionContainer'

type TransactionsProps = {
  scrollParent: HTMLElement | null
}

// Number of most-recent groups expanded by default on first load.
const DEFAULT_EXPANDED_COUNT = 3

const Transactions = ({ scrollParent }: TransactionsProps) => {
  const { data } = useAppSelector((state) => state.mainReducer)
  const [selectedTransaction, setSelectedTransaction] = useState('')
  const { isExpanded, toggle } = useExpandableGroups(
    data,
    (group) => group.date,
    DEFAULT_EXPANDED_COUNT
  )
  const { formatMessage } = useIntl()

  // Reset selected transaction when data changes
  useEffect(() => {
    setSelectedTransaction('')
  }, [data.length])

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

      {scrollParent && (
        <Virtuoso
          customScrollParent={scrollParent}
          data={data}
          computeItemKey={(_, item) => item.date}
          itemContent={(index, item) => (
            <div className="transactions__item">
              <TransactionContainer
                data={item}
                index={index}
                isExpanded={isExpanded(item.date)}
                onToggle={toggle}
                selectedTransaction={selectedTransaction}
                setSelectedTransaction={setSelectedTransaction}
              />
            </div>
          )}
        />
      )}
    </div>
  )
}

export default Transactions

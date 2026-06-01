import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Virtuoso } from 'react-virtuoso'
import { useIntl } from 'react-intl'
import type { LayoutContextType } from '@/components/Layout'
import {
  DEFAULT_EXPANDED_COUNT,
  DEFAULT_VISIBLE_GROUPS,
} from '@/constants/config'
import { useAppSelector, useExpandableGroups } from '@/hooks'
import { formatMonthLabel, shouldShowMonthHeader } from '@/utils'
import TransactionContainer from './TransactionContainer'
import { SpinnerSvg } from '@/assets'

const Transactions = () => {
  const { scrollParent } = useOutletContext<LayoutContextType>()
  const { data, isLoading } = useAppSelector(
    (state) => state.transactionsReducer
  )
  const [selectedTransaction, setSelectedTransaction] = useState('')
  const [showAll, setShowAll] = useState(false)
  const { isExpanded, toggle } = useExpandableGroups(
    data,
    (group) => group.date,
    DEFAULT_EXPANDED_COUNT
  )
  const { formatMessage } = useIntl()

  // Collapse to the first few date groups until the user opts into the full list.
  const hasMore = data.length > DEFAULT_VISIBLE_GROUPS
  const visibleData = showAll ? data : data.slice(0, DEFAULT_VISIBLE_GROUPS)
  const toggleShowAll = () => setShowAll((prev) => !prev)

  // Reset selected transaction when data changes
  useEffect(() => {
    setSelectedTransaction('')
  }, [data.length])

  if (isLoading && !data.length)
    return (
      <div className="transactions flex-1 flex-justify-center flex-align-center">
        <SpinnerSvg className="icon--xl icon--fill-primary spin" />
      </div>
    )

  if (!data.length)
    return (
      <div className="transactions">
        <div className="flex-justify-center flex-align-center flex-1">
          <span className="text--italic text--light">
            {formatMessage({ id: 'NoTransaction' })}
          </span>
        </div>
      </div>
    )

  return (
    <div className="transactions">
      <div className="flex-space-between mb-2">
        <div className="flex-column">
          <span className="text--bold">
            {formatMessage({ id: 'RecentTransactions' })}
          </span>
          <span className="text--light text--3">
            {formatMessage({ id: 'TransactionCount' }, { count: data.length })}
          </span>
        </div>

        {hasMore && (
          <button
            type="button"
            className="btn btn-clear"
            onClick={toggleShowAll}
          >
            <span className="text--3 text--color-primary">
              {formatMessage({ id: showAll ? 'ShowLess' : 'ViewAll' })}
            </span>
          </button>
        )}
      </div>

      {scrollParent && (
        <Virtuoso
          customScrollParent={scrollParent}
          data={visibleData}
          computeItemKey={(_, item) => item.date}
          itemContent={(index, item) => (
            <div className="transactions__item">
              {shouldShowMonthHeader(item.date, data[index - 1]?.date) &&
                index > 0 && (
                  <span className="transactions__month-header">
                    {formatMessage({ id: formatMonthLabel(item.date) })}
                  </span>
                )}
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

      {hasMore && !showAll && (
        <div className="flex-justify-center flex-align-center mb-4">
          <button
            type="button"
            className="btn btn-clear"
            onClick={toggleShowAll}
          >
            <span className="text--italic text--3 text--color-primary">
              {formatMessage(
                { id: 'SeeMoreTransactions' },
                { count: data.length - DEFAULT_VISIBLE_GROUPS }
              )}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

export default Transactions

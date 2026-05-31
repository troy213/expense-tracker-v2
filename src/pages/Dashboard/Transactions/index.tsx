import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Virtuoso } from 'react-virtuoso'
import { useIntl } from 'react-intl'
import type { LayoutContextType } from '@/components/Layout'
import { DEFAULT_EXPANDED_COUNT } from '@/constants/config'
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

  if (isLoading)
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
      {scrollParent && (
        <Virtuoso
          customScrollParent={scrollParent}
          data={data}
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
    </div>
  )
}

export default Transactions

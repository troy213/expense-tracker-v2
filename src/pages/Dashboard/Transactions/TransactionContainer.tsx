import { memo, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useAppSelector } from '@/hooks'
import { Data, TxFormData } from '@/types'
import {
  calculateSubdataSummary,
  combineClassName,
  currencyFormatter,
  formatTransactionDate,
} from '@/utils'
import TransactionDetail from './TransactionDetail'

type TransactionContainerProps = {
  data: Data
  index: number
  isExpanded: boolean
  onToggle: (date: string) => void
  selectedTransaction: string
  setSelectedTransaction: (val: string) => void
}

const TransactionContainer: React.FC<TransactionContainerProps> = ({
  data,
  index,
  isExpanded,
  onToggle,
  selectedTransaction,
  setSelectedTransaction,
}) => {
  const { date, subdata } = data
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const { formatMessage } = useIntl()

  const { totalSubdataIncome, totalSubdataExpense } = useMemo(() => {
    return calculateSubdataSummary(subdata, categories)
  }, [subdata, categories])

  // The collapse wrapper must clip its content (overflow: hidden) while it is
  // collapsed or animating, otherwise the grid trick can't hide the rows. But
  // that same clip eats the more-options dropdown. So we only clip until a
  // group is fully open: a row that mounts already-expanded starts visible (it
  // doesn't animate), and a toggle-to-open switches to visible once the grid
  // transition settles.
  const [allowOverflow, setAllowOverflow] = useState(isExpanded)

  useEffect(() => {
    // Collapsing: clip immediately so the closing animation hides its content.
    if (!isExpanded) setAllowOverflow(false)
  }, [isExpanded])

  const handleExpandableTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === 'grid-template-rows' && isExpanded) {
      setAllowOverflow(true)
    }
  }

  const handleSelectTransaction = (e: React.FormEvent, id: string) => {
    e.stopPropagation()

    const newTransactionId = `${index}_${id}`

    if (selectedTransaction && selectedTransaction === newTransactionId)
      return setSelectedTransaction('')
    setSelectedTransaction(newTransactionId)
  }

  const handleExpand = () => {
    onToggle(date)
    setSelectedTransaction('')
  }

  // Collapse uses the CSS grid `grid-template-rows: 0fr -> 1fr` trick (see
  // SCSS). An already-expanded row renders straight at `1fr` with no value
  // change, so it never animates on mount/remount — only a real toggle does.
  const expandableClassName = combineClassName(
    'transaction-detail-container__expandable-container',
    [{ condition: isExpanded, className: 'is-expanded' }]
  )

  const expandableInnerClassName = combineClassName(
    'transaction-detail-container__expandable-inner',
    [{ condition: allowOverflow, className: 'is-overflow-visible' }]
  )

  return (
    <div className="transaction-detail-container" onClick={handleExpand}>
      <span className="text--italic text--light text--3">
        {formatTransactionDate(date, formatMessage, {
          enableTodayFormat: true,
        })}
      </span>

      <div
        className={expandableClassName}
        onTransitionEnd={handleExpandableTransitionEnd}
      >
        <div className={expandableInnerClassName}>
          {subdata.map((subitem, subdataIndex) => {
            const transactionDetailData: TxFormData = {
              date,
              category_id: subitem.category_id,
              item: subitem.item,
            }

            return (
              <TransactionDetail
                data={transactionDetailData}
                dataIndex={index}
                subdataIndex={subdataIndex}
                selectedTransaction={selectedTransaction}
                handleSelectTransaction={handleSelectTransaction}
                key={subitem.category_id}
              />
            )
          })}
        </div>
      </div>

      <div className="transaction-detail-container__transaction-summary">
        <div className="flex-space-between flex-align-center">
          <span className="text--3">{formatMessage({ id: 'Income' })}</span>
          <span className="text--bold text--3">
            {currencyFormatter(totalSubdataIncome)}
          </span>
        </div>
        <div className="flex-space-between flex-align-center">
          <span className="text--3">{formatMessage({ id: 'Expense' })}</span>
          <span className="text--bold text--color-danger text--3">
            {currencyFormatter(totalSubdataExpense)}
          </span>
        </div>
      </div>
    </div>
  )
}

const MemoizedTransactionContainer = memo(TransactionContainer)
export default MemoizedTransactionContainer

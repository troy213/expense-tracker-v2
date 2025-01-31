import { useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Data } from '@/types'
import {
  calculateSubdataSummary,
  currencyFormatter,
  formatTransactionDate,
} from '@/utils'
import TransactionDetail from './TransactionDetail'

type TransactionContainerProps = {
  data: Data
  index: number
  selectedTransaction: string
  setSelectedTransaction: (val: string) => void
}

const TransactionContainer: React.FC<TransactionContainerProps> = ({
  data,
  index,
  selectedTransaction,
  setSelectedTransaction,
}) => {
  const { id, date, subdata } = data
  const [isExpanded, setIsExpanded] = useState(index < 3)
  const contentRef = useRef<HTMLDivElement>(null)
  const { formatMessage } = useIntl()

  const { totalSubdataIncome, totalSubdataExpense } = useMemo(() => {
    return calculateSubdataSummary(subdata)
  }, [subdata])

  const expandableStyle = {
    maxHeight: isExpanded ? `${contentRef.current?.scrollHeight}px` : '0px',
  }

  const handleSelectTransaction = (e: React.FormEvent, id: string) => {
    e.stopPropagation()

    if (selectedTransaction && selectedTransaction === id)
      return setSelectedTransaction('')
    setSelectedTransaction(id)
  }

  const handleExpand = () => {
    setIsExpanded((prevState) => !prevState)
    setSelectedTransaction('')
  }

  return (
    <div
      className="transaction-detail-container"
      key={id}
      onClick={handleExpand}
    >
      <span className="text--italic text--light text--3">
        {formatTransactionDate(date, formatMessage, {
          enableTodayFormat: true,
        })}
      </span>

      <div
        className="transaction-detail-container__expandable-container"
        ref={contentRef}
        style={expandableStyle}
      >
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

export default TransactionContainer

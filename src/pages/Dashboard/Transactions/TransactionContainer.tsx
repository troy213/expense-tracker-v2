import { useEffect, useMemo, useRef, useState, memo } from 'react'
import { useIntl } from 'react-intl'
import { useAppSelector } from '@/hooks'
import { Data, TxFormData } from '@/types'
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
  const { date, subdata } = data
  const [isExpanded, setIsExpanded] = useState(index < 3)
  const [height, setHeight] = useState('0px')
  const contentRef = useRef<HTMLDivElement>(null)
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const { formatMessage } = useIntl()

  const { totalSubdataIncome, totalSubdataExpense } = useMemo(() => {
    return calculateSubdataSummary(subdata, categories)
  }, [subdata, categories])

  const expandableStyle = {
    maxHeight: isExpanded ? height : '0px',
  }

  const handleSelectTransaction = (e: React.FormEvent, id: string) => {
    e.stopPropagation()

    const newTransactionId = `${index}_${id}`

    if (selectedTransaction && selectedTransaction === newTransactionId)
      return setSelectedTransaction('')
    setSelectedTransaction(newTransactionId)
  }

  const handleExpand = () => {
    setIsExpanded((prevState) => !prevState)
    setSelectedTransaction('')
  }

  useEffect(() => {
    if (contentRef.current) {
      // Add a small buffer (8px) to account for line-height and spacing
      const scrollHeight = contentRef.current.scrollHeight
      setHeight(`${scrollHeight + 8}px`)
    }
  }, [data])

  return (
    <div
      className="transaction-detail-container"
      key={date}
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

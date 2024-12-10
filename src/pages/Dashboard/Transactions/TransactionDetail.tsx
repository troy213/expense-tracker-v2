import { MoreVerticalSvg } from '@/assets'
import { Data } from '@/types'
import {
  combineClassName,
  currencyFormatter,
  formatTransactionDate,
} from '@/utils'
import { useState } from 'react'
import MoreOptionModal from './MoreOptionModal'

type TransactionDetailProps = {
  data: Data
  selectedTransaction: string
  handleSelectTransaction: (id: string) => void
}

const sumTotalItemValue = (item: Data['subdata'][0]['item']): number => {
  return item.reduce(
    (accumulator, currValue) => accumulator + currValue.amount,
    0
  )
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({
  data,
  selectedTransaction,
  handleSelectTransaction,
}) => {
  const { date, subdata } = data

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleMoreOption = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsModalOpen((val) => !val)
  }

  return (
    <div className="transaction-detail">
      <div className="flex-column gap-4">
        <span className="text--italic text--light text--3">
          {formatTransactionDate(date)}
        </span>

        {subdata.map((subdataItem) => {
          const isOutcome = subdataItem.type === 'expense'
          const totalItemValue = isOutcome
            ? -1 * sumTotalItemValue(subdataItem.item)
            : sumTotalItemValue(subdataItem.item)
          const totalItemValueClassName = combineClassName('', [
            { condition: isOutcome, className: 'text--color-danger' },
          ])

          return (
            <div
              className="flex-column gap-1"
              key={subdataItem.id}
              onClick={() => {
                handleSelectTransaction(subdataItem.id)
                setIsModalOpen(false)
              }}
            >
              <div className="flex-space-between">
                <span>{subdataItem.category}</span>
                <div className="flex-align-center gap-2">
                  <span className={totalItemValueClassName}>
                    {currencyFormatter(totalItemValue)}
                  </span>
                  {selectedTransaction === subdataItem.id && (
                    <div className="relative">
                      <button
                        className=" btn btn-clear"
                        type="button"
                        onClick={(e) => handleMoreOption(e)}
                      >
                        <MoreVerticalSvg className="icon--stroke-primary" />
                      </button>
                      {isModalOpen && <MoreOptionModal />}
                    </div>
                  )}
                </div>
              </div>
              {subdataItem.item.map((item, index) => {
                const amount = isOutcome ? -1 * item.amount : item.amount
                const amountClassName = combineClassName(
                  'text--light text--3',
                  [{ condition: isOutcome, className: 'text--color-danger' }]
                )

                return (
                  <div className="flex-space-between" key={index}>
                    <span className="text--light text--3">
                      {item.description}
                    </span>
                    <span className={amountClassName}>
                      {currencyFormatter(amount)}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TransactionDetail

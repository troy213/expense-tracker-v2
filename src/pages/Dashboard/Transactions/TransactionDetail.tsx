import { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { MoreVerticalSvg } from '@/assets'
import { Data } from '@/types'
import {
  calculateModalBottomThreshold,
  combineClassName,
  currencyFormatter,
  formatTransactionDate,
} from '@/utils'
import MoreOptionModal from '@/components/Modal/MoreOptionModal'
import DeleteDataModal from '@/components/Modal/DeleteDataModal'
import { useAppDispatch } from '@/hooks'
import { mainAction } from '@/store/main/main-slice'

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

const getModalPositionClassName = (elementRect: DOMRect | undefined) => {
  const modalBottomThreshold = calculateModalBottomThreshold()
  const viewPortHeight = window.innerHeight
  const elementSizeDiff = viewPortHeight - (elementRect?.bottom ?? 0)

  if (elementSizeDiff < modalBottomThreshold) return 'modal--top'
  return ''
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({
  data,
  selectedTransaction,
  handleSelectTransaction,
}) => {
  const { date, subdata } = data
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [moreOptionModalClassName, setMoreOptionModalClassName] = useState('')
  const transactionRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const handleMoreOption = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const elementRect = transactionRefs.current.get(id)?.getBoundingClientRect()
    setMoreOptionModalClassName(getModalPositionClassName(elementRect))
    setIsMoreModalOpen((val) => !val)
  }

  const handleDeleteTransaction = () => {
    if (!deleteTargetId) return
    dispatch(mainAction.deleteTransaction({ subdataId: deleteTargetId }))
    setIsDeleteModalOpen(false)
    setDeleteTargetId(null)
  }

  const openDeleteModal = (id: string) => {
    setDeleteTargetId(id)
    setIsDeleteModalOpen(true)
  }

  return (
    <div className="transaction-detail">
      <div className="flex-column gap-4">
        <span className="text--italic text--light text--3">
          {formatTransactionDate(date, { enableTodayFormat: true })}
        </span>

        {subdata.map((subdataItem) => {
          const isExpense = subdataItem.type === 'expense'
          const totalItemValue = isExpense
            ? -1 * sumTotalItemValue(subdataItem.item)
            : sumTotalItemValue(subdataItem.item)
          const totalItemValueClassName = combineClassName('', [
            { condition: isExpense, className: 'text--color-danger' },
          ])

          return (
            <div
              className="flex-column gap-1"
              key={subdataItem.id}
              ref={(el) => {
                if (el) transactionRefs.current.set(subdataItem.id, el)
                else transactionRefs.current.delete(subdataItem.id)
              }}
              onClick={() => {
                handleSelectTransaction(subdataItem.id)
                setIsMoreModalOpen(false)
              }}
            >
              <DeleteDataModal
                isModalOpen={isDeleteModalOpen}
                handleOpenModal={setIsDeleteModalOpen}
                title={formatMessage({ id: 'DeleteTransaction' })}
                message={formatMessage({ id: 'DeleteDataGeneral' })}
                handleDelete={handleDeleteTransaction}
              />
              <div className="flex-space-between">
                <span>{subdataItem.category}</span>
                <div className="flex-align-center gap-2">
                  <span className={totalItemValueClassName}>
                    {currencyFormatter(totalItemValue)}
                  </span>
                  {selectedTransaction === subdataItem.id && (
                    <div className="relative">
                      <button
                        className="btn btn-clear"
                        type="button"
                        onClick={(e) => handleMoreOption(e, subdataItem.id)}
                      >
                        <MoreVerticalSvg className="icon icon--stroke-primary" />
                      </button>
                      {isMoreModalOpen && (
                        <MoreOptionModal
                          className={moreOptionModalClassName}
                          handleDelete={() => {
                            setIsMoreModalOpen(false)
                            openDeleteModal(subdataItem.id)
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {subdataItem.item.map((item, index) => {
                const hasMoreItem = subdataItem.item.length > 1
                const amount = isExpense ? -1 * item.amount : item.amount
                const amountClassName = combineClassName(
                  'text--light text--3',
                  [{ condition: isExpense, className: 'text--color-danger' }]
                )

                return (
                  <div className="flex-space-between" key={index}>
                    <span className="text--light text--3">
                      {item.description}
                    </span>
                    {hasMoreItem && (
                      <span className={amountClassName}>
                        {currencyFormatter(amount)}
                      </span>
                    )}
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

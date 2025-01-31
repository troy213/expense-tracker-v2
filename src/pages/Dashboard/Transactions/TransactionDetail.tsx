import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { MoreVerticalSvg } from '@/assets'
import MoreOptionModal from '@/components/Modal/MoreOptionModal'
import DeleteDataModal from '@/components/Modal/DeleteDataModal'
import { useAppDispatch } from '@/hooks'
import { Data } from '@/types'
import { mainAction } from '@/store/main/main-slice'
import { combineClassName, currencyFormatter } from '@/utils'
import FormTransactionModal from '@/components/Modal/FormTransactionModal'

type TransactionDetailProps = {
  data: Data['subdata'][0]
  dataIndex: number
  subdataIndex: number
  selectedTransaction: string
  handleSelectTransaction: (event: React.FormEvent, id: string) => void
}

const sumTotalItemValue = (item: Data['subdata'][0]['item']): number => {
  return item.reduce(
    (accumulator, currValue) => accumulator + currValue.amount,
    0
  )
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({
  data,
  dataIndex,
  subdataIndex,
  selectedTransaction,
  handleSelectTransaction,
}) => {
  const { id, type, category, item } = data
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const transactionRefs = useRef<HTMLDivElement>(null)
  const { formatMessage } = useIntl()
  const dispatch = useAppDispatch()

  const isExpense = type === 'expense'
  const totalItemValue = isExpense
    ? -1 * sumTotalItemValue(item)
    : sumTotalItemValue(item)
  const totalItemValueClassName = combineClassName('', [
    { condition: isExpense, className: 'text--color-danger' },
  ])

  const handleMoreOption = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMoreModalOpen((val) => !val)
  }

  const handleDeleteTransaction = () => {
    dispatch(mainAction.deleteTransaction({ subdataId: id }))
    setIsDeleteModalOpen(false)
  }

  useEffect(() => {
    setIsMoreModalOpen(false)
  }, [selectedTransaction])

  return (
    <div
      className="transaction-detail"
      ref={transactionRefs}
      onClick={(e) => handleSelectTransaction(e, id)}
    >
      {isEditModalOpen && (
        <FormTransactionModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          indexes={{ dataIndex, subdataIndex }}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteDataModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          title={formatMessage({ id: 'DeleteTransaction' })}
          message={formatMessage({ id: 'DeleteDataGeneral' })}
          handleDelete={handleDeleteTransaction}
        />
      )}
      <div className="flex-space-between">
        <span>{category}</span>
        <div className="flex-align-center gap-2">
          <span className={totalItemValueClassName}>
            {currencyFormatter(totalItemValue)}
          </span>
          {selectedTransaction === id && (
            <div className="relative">
              <button
                className="btn btn-clear"
                type="button"
                onClick={handleMoreOption}
              >
                <MoreVerticalSvg className="icon icon--stroke-primary" />
              </button>
              {isMoreModalOpen && (
                <MoreOptionModal
                  handleDelete={() => {
                    setIsMoreModalOpen(false)
                    setIsDeleteModalOpen(true)
                  }}
                  handleEdit={() => {
                    setIsMoreModalOpen(false)
                    setIsEditModalOpen(true)
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
      {item.map((subitem, index) => {
        const hasMoreItem = data.item.length > 1
        const amount = isExpense ? -1 * subitem.amount : subitem.amount
        const amountClassName = combineClassName('text--light text--3', [
          { condition: isExpense, className: 'text--color-danger' },
        ])

        return (
          <div className="flex-space-between" key={index}>
            <span className="text--light text--3">{subitem.description}</span>
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
}

export default TransactionDetail

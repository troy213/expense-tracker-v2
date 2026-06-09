import { useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import { MoreVerticalSvg } from '@/assets'
import { CategoryIcon, FormModal } from '@/components'
import MoreOptionMenu from '@/components/Menu/MoreOptionMenu'
import DeleteDataModal from '@/components/Modal/DeleteDataModal'
import {
  useAppDispatch,
  useAppSelector,
  useClickOutside,
  useDisclosure,
} from '@/hooks'
import { TxFormData } from '@/types'
import { deleteDBTransactions } from '@/store/transactions/transactions-thunk'
import {
  combineClassName,
  currencyFormatter,
  getCategoryById,
  getDefaultCategoryIconColor,
} from '@/utils'
import './TransactionDetail.scss'

type TransactionDetailProps = {
  data: TxFormData
  dataIndex: number
  subdataIndex: number
  selectedTransaction: string
  handleSelectTransaction: (event: React.FormEvent, id: string) => void
}

const sumTotalItemValue = (item: TxFormData['item']): number => {
  return item.reduce(
    (accumulator, currValue) => accumulator + currValue.amount,
    0
  )
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({
  data,
  dataIndex,
  selectedTransaction,
  handleSelectTransaction,
}) => {
  const { category_id, item } = data
  const moreMenu = useDisclosure()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()
  const transactionRefs = useRef<HTMLDivElement>(null)
  const moreOptionMenuRef = useRef<HTMLDivElement>(null)
  const { formatMessage } = useIntl()
  const dispatch = useAppDispatch()
  const categories = useAppSelector(
    (state) => state.categoriesReducer.categories
  )
  useClickOutside(moreOptionMenuRef, moreMenu.close, moreMenu.isOpen)

  const category = getCategoryById(category_id, categories)
  const defaultCategoryIcon = category?.type === 'income' ? 'income' : 'expense'
  const defaultCategoryIconColor = getDefaultCategoryIconColor(category?.type)

  const isExpense = category?.type === 'expense'
  const totalItemValue = isExpense
    ? -1 * sumTotalItemValue(item)
    : sumTotalItemValue(item)
  const totalItemValueClassName = combineClassName('', [
    { condition: isExpense, className: 'text--color-danger' },
  ])

  const handleMoreOption = (e: React.MouseEvent) => {
    e.stopPropagation()
    moreMenu.toggle()
  }

  const handleDeleteTransaction = () => {
    dispatch(deleteDBTransactions({ data, index: dataIndex }))
    deleteModal.close()
  }

  // close() is a stable ref from useDisclosure; depend on it (not the whole
  // moreMenu object) so this only re-runs when the selected row changes.
  const { close: closeMoreMenu } = moreMenu
  useEffect(() => {
    closeMoreMenu()
  }, [selectedTransaction, closeMoreMenu])

  return (
    <div
      className="transaction-detail"
      ref={transactionRefs}
      onClick={(e) => handleSelectTransaction(e, category_id)}
    >
      <FormModal.FormTransaction
        data={data}
        index={dataIndex}
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        onCancel={editModal.close}
      />

      {deleteModal.isOpen && (
        <DeleteDataModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          title={formatMessage({ id: 'DeleteTransaction' })}
          message={formatMessage({ id: 'DeleteDataGeneral' })}
          handleDelete={handleDeleteTransaction}
        />
      )}
      <CategoryIcon
        iconId={category?.icon_id ?? defaultCategoryIcon}
        color={category?.color ?? defaultCategoryIconColor}
        isActive={category?.is_active}
      />
      <div className="flex-column flex-1 gap-1">
        <div className="flex-space-between">
          <span>{category?.name}</span>
          <div className="flex-align-center gap-2">
            <span className={totalItemValueClassName}>
              {currencyFormatter(totalItemValue)}
            </span>
            {selectedTransaction === `${dataIndex}_${category_id}` && (
              <div className="relative" ref={moreOptionMenuRef}>
                <button
                  className="btn btn-clear"
                  type="button"
                  onClick={handleMoreOption}
                  aria-label={formatMessage({ id: 'MoreOptions' })}
                >
                  <MoreVerticalSvg className="icon icon--color-primary" />
                </button>
                {moreMenu.isOpen && (
                  <MoreOptionMenu
                    handleDelete={() => {
                      moreMenu.close()
                      deleteModal.open()
                    }}
                    handleEdit={() => {
                      moreMenu.close()
                      editModal.open()
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
        {category && !category.is_active && (
          <div className="mt-1">
            <span className="pill pill--default">
              {formatMessage({ id: 'Archived' })}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionDetail

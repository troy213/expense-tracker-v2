import { useRef, useState } from 'react'
import { CoinsSvg, MoreVerticalSvg } from '@/assets'
import MoreOptionModal from '@/components/Modal/MoreOptionModal'
import { CategoryType } from '@/types'
import { calculateModalBottomThreshold, currencyFormatter } from '@/utils'
import { useAppDispatch } from '@/hooks'
import { categoriesAction } from '@/store/categories/categories-slice'
import DeleteDataModal from '@/components/Modal/DeleteDataModal'
import { useIntl } from 'react-intl'
import InputCategoryModal from '@/components/Modal/FormCategoryModal'

type CategoryWidgetProps = {
  id: string
  type: CategoryType
  name: string
  budget: number
}

const getModalPositionClassName = (elementRect: DOMRect | undefined) => {
  const modalBottomThreshold = calculateModalBottomThreshold()
  const viewPortHeight = window.innerHeight
  const elementSizeDiff = viewPortHeight - (elementRect?.bottom ?? 0)

  if (elementSizeDiff < modalBottomThreshold) return 'modal--top'
  return ''
}

const CategoryWidget: React.FC<CategoryWidgetProps> = ({
  id,
  type,
  name,
  budget,
}) => {
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
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

  const handleDeleteCategory = (id: string) => {
    dispatch(categoriesAction.deleteCategory({ id }))
  }

  return (
    <div className="category-widget p-4">
      <InputCategoryModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        selectedCategory={type}
        selectedId={id}
      />
      <DeleteDataModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title={formatMessage({ id: 'DeleteCategory' })}
        message={
          formatMessage(
            { id: 'DeleteDataSpecific' },
            { name: <strong>{name}</strong> }
          ) as string
        }
        handleDelete={() => handleDeleteCategory(id)}
      />
      <div className="flex-space-between flex-align-center">
        <div className="flex-column gap-2">
          <span>{name}</span>
          {type === 'expense' && (
            <div className="flex-align-center gap-2">
              <CoinsSvg className="icon--fill-primary" />
              <span className="text--light text--3">
                {currencyFormatter(budget)}
              </span>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            className="btn btn-clear"
            onClick={(e) => handleMoreOption(e, id)}
          >
            <MoreVerticalSvg className="icon--stroke-primary" />
          </button>
          {isMoreModalOpen && (
            <MoreOptionModal
              className={moreOptionModalClassName}
              handleEdit={() => {
                setIsMoreModalOpen(false)
                setIsEditModalOpen(true)
              }}
              handleDelete={() => {
                setIsMoreModalOpen(false)
                setIsDeleteModalOpen(true)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryWidget

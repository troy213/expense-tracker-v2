import { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CoinsSvg, MoreVerticalSvg } from '@/assets'
import { CategoryIcon, FormModal, Modal } from '@/components'
import DeleteDataModal from '@/components/Modal/DeleteDataModal'
import MoreOptionMenu from '@/components/Menu/MoreOptionMenu'
import { useAppDispatch, useClickOutside, useDisclosure } from '@/hooks'
import { Category } from '@/types'
import { deleteDBCategory } from '@/store/categories/categories-thunk'
import {
  calculateModalBottomThreshold,
  currencyFormatter,
  getDefaultCategoryIconColor,
} from '@/utils'
import './CategoryWidget.scss'

type CategoryWidgetProps = {
  data: Category
  selectedCategoryId: string | null
  setSelectedCategoryId: (id: string | null) => void
}

const getModalPositionClassName = (elementRect: DOMRect | undefined) => {
  const modalBottomThreshold = calculateModalBottomThreshold()
  const viewPortHeight = window.innerHeight
  const elementSizeDiff = viewPortHeight - (elementRect?.bottom ?? 0)

  if (elementSizeDiff < modalBottomThreshold) return 'modal--top'
  return ''
}

const CategoryWidget: React.FC<CategoryWidgetProps> = ({
  data,
  selectedCategoryId,
  setSelectedCategoryId,
}) => {
  const { id, name, type, budget = 0, icon_id, color, is_active } = data
  const moreMenu = useDisclosure()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()
  const [moreOptionModalClassName, setMoreOptionModalClassName] = useState('')
  const transactionRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const moreOptionMenuRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  useClickOutside(moreOptionMenuRef, moreMenu.close, moreMenu.isOpen)

  const newTransform = transform
    ? { ...transform, scaleX: 1.05, scaleY: 1.05 }
    : null

  const style = {
    transition,
    transform: CSS.Transform.toString(newTransform),
  }

  const defaultCategoryIcon = type === 'income' ? 'income' : 'expense'
  const defaultCategoryIconColor = getDefaultCategoryIconColor(type)

  const handleMoreOption = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const elementRect = transactionRefs.current.get(id)?.getBoundingClientRect()
    setMoreOptionModalClassName(getModalPositionClassName(elementRect))
    moreMenu.toggle()
    setSelectedCategoryId(id)
  }

  const handleDeleteCategory = (category: Category) => {
    dispatch(deleteDBCategory(category))
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="category-widget p-4"
    >
      <Modal isOpen={editModal.isOpen} onClose={editModal.close}>
        <FormModal.FormCategory
          data={data}
          type={type}
          onCancel={editModal.close}
        />
      </Modal>

      {deleteModal.isOpen && (
        <DeleteDataModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          title={formatMessage({ id: 'DeleteCategory' })}
          message={
            formatMessage(
              { id: 'DeleteDataSpecific' },
              { name: <strong>{name}</strong> }
            ) as string
          }
          handleDelete={() => handleDeleteCategory(data)}
        />
      )}
      <div className="flex-space-between flex-align-center">
        <div className="flex-align-center gap-4">
          <CategoryIcon
            iconId={icon_id ?? defaultCategoryIcon}
            color={color ?? defaultCategoryIconColor}
            isActive={is_active}
          />
          <div className="flex-column flex-justify-center gap-2">
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
        </div>

        <div className="relative" ref={moreOptionMenuRef}>
          <button
            type="button"
            className="btn btn-clear"
            onClick={(e) => handleMoreOption(e, id)}
          >
            <MoreVerticalSvg className="icon--stroke-primary" />
          </button>
          {moreMenu.isOpen && selectedCategoryId === id && (
            <MoreOptionMenu
              className={moreOptionModalClassName}
              handleEdit={() => {
                moreMenu.close()
                editModal.open()
              }}
              handleDelete={() => {
                moreMenu.close()
                deleteModal.open()
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryWidget

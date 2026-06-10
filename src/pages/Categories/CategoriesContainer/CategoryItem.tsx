import { useCallback, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CoinsSvg, MoreVerticalSvg } from '@/assets'
import { CategoryIcon, FormModal } from '@/components'
import DeleteDataModal from '@/components/Modal/DeleteDataModal'
import MoreOptionMenu from '@/components/Menu/MoreOptionMenu'
import { useAppDispatch, useClickOutside, useDisclosure } from '@/hooks'
import { Category } from '@/types'
import { deleteDBCategory } from '@/store/categories/categories-thunk'
import { currencyFormatter, getDefaultCategoryIconColor } from '@/utils'
import { useCategoriesContext } from '../CategoriesContext'
import './CategoryItem.scss'

type CategoryItemProps = {
  data: Category
}

const CategoryItem: React.FC<CategoryItemProps> = ({ data }) => {
  const { id, name, type, budget = 0, icon_id, color, is_active } = data
  const { selectedCategoryId, setSelectedCategoryId } = useCategoriesContext()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()
  const moreOptionMenuRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const isMenuOpen = selectedCategoryId === id
  const closeMenu = useCallback(
    () => setSelectedCategoryId(null),
    [setSelectedCategoryId]
  )
  useClickOutside(moreOptionMenuRef, closeMenu, isMenuOpen)

  const newTransform = transform
    ? { ...transform, scaleX: 1.05, scaleY: 1.05 }
    : null

  const style = {
    transition,
    transform: CSS.Transform.toString(newTransform),
  }

  const defaultCategoryIcon = type === 'income' ? 'income' : 'expense'
  const defaultCategoryIconColor = getDefaultCategoryIconColor(type)

  const handleMoreOption = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedCategoryId(isMenuOpen ? null : id)
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
      className="category-item p-4"
    >
      <FormModal.FormCategory
        data={data}
        type={type}
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        onCancel={editModal.close}
      />

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
                <CoinsSvg className="icon--color-primary" />
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
            onClick={handleMoreOption}
            aria-label={formatMessage({ id: 'MoreOptions' })}
          >
            <MoreVerticalSvg className="icon--color-primary" />
          </button>
          {isMenuOpen && (
            <MoreOptionMenu
              handleEdit={() => {
                closeMenu()
                editModal.open()
              }}
              handleDelete={() => {
                closeMenu()
                deleteModal.open()
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryItem

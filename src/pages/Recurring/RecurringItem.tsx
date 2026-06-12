import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { MoreVerticalSvg } from '@/assets'
import { CategoryIcon, FormModal } from '@/components'
import DeleteDataModal from '@/components/Modal/DeleteDataModal'
import MoreOptionMenu from '@/components/Menu/MoreOptionMenu'
import {
  useAppDispatch,
  useAppSelector,
  useClickOutside,
  useDisclosure,
} from '@/hooks'
import { Recurring } from '@/types'
import { deleteDBRecurring } from '@/store/recurring/recurring-thunk'
import { combineClassName, currencyFormatter } from '@/utils'
import './RecurringItem.scss'

type RecurringItemProps = {
  definition: Recurring
  isMenuOpen: boolean
  onMenuToggle: (id: string | null) => void
}

const RecurringItem = ({
  definition,
  isMenuOpen,
  onMenuToggle,
}: RecurringItemProps) => {
  const { formatMessage } = useIntl()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()
  const menuRef = useRef<HTMLDivElement>(null)

  const hasPending = useAppSelector((s) =>
    s.recurringReducer.history.some(
      (r) => r.recurring_id === definition.id && r.status === 'pending'
    )
  )
  const category = useAppSelector((s) =>
    s.categoriesReducer.categories.find((c) => c.id === definition.category_id)
  )

  const closeMenu = useCallback(() => onMenuToggle(null), [onMenuToggle])
  useClickOutside(menuRef, closeMenu, isMenuOpen)

  const handleRowClick = () => navigate(`/recurring-detail?id=${definition.id}`)

  const handleRowKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleRowClick()
    }
  }

  const handleMoreOption = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMenuToggle(isMenuOpen ? null : definition.id)
  }

  const itemClassName = combineClassName('recurring-item p-4', [
    { condition: hasPending, className: 'recurring-item--pending' },
    { condition: !definition.is_active, className: 'recurring-item--inactive' },
  ])

  return (
    <div
      className={itemClassName}
      onClick={handleRowClick}
      role="button"
      tabIndex={0}
      aria-label={formatMessage(
        { id: 'ViewRecurringDetail' },
        { name: definition.recurring_name }
      )}
      onKeyDown={handleRowKeyDown}
    >
      <FormModal.FormRecurring
        isOpen={editModal.isOpen}
        data={definition}
        onClose={editModal.close}
        onCancel={editModal.close}
      />

      {deleteModal.isOpen && (
        <DeleteDataModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          title={formatMessage({ id: 'DeleteRecurring' })}
          message={formatMessage(
            { id: 'DeleteRecurringMessage' },
            { name: definition.recurring_name }
          )}
          handleDelete={() => dispatch(deleteDBRecurring(definition.id))}
        />
      )}

      <div className="flex-space-between flex-align-center gap-2">
        <div className="flex-align-center gap-4">
          {category && (
            <CategoryIcon
              iconId={category.icon_id}
              color={category.color}
              isActive={definition.is_active}
            />
          )}
          <div className="flex-column">
            <span className="text--bold text--color-primary">
              {definition.recurring_name}
            </span>
            <span className="text--light text--3 text--italic">
              {formatMessage(
                { id: 'EveryMonthOnDay' },
                { day: definition.due_day }
              )}
            </span>
          </div>
        </div>

        <div className="relative flex-align-center gap-2" ref={menuRef}>
          <div className="flex-column flex-align-end gap-1">
            <span className="text--light text--3">
              {currencyFormatter(definition.amount)}
            </span>
            <span
              className={`pill pill--${definition.is_active ? 'primary' : 'default'} text--uppercase`}
            >
              {formatMessage({
                id: definition.is_active ? 'Active' : 'Inactive',
              })}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-clear"
            onClick={handleMoreOption}
            aria-label={formatMessage({ id: 'MoreOptions' })}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
          >
            <MoreVerticalSvg
              className="icon--color-primary"
              aria-hidden="true"
            />
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

export default RecurringItem

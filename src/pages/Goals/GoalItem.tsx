import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { MoreVerticalSvg, PlaySvg, SquareSvg } from '@/assets'
import { CategoryIcon, FormModal, ProgressBar } from '@/components'
import DeleteDataModal from '@/components/Modal/DeleteDataModal'
import MoreOptionMenu from '@/components/Menu/MoreOptionMenu'
import {
  useAppDispatch,
  useAppSelector,
  useClickOutside,
  useDisclosure,
} from '@/hooks'
import { Goal } from '@/types'
import {
  cancelDBGoal,
  deleteDBGoal,
  resumeDBGoal,
} from '@/store/goals/goals-thunk'
import {
  combineClassName,
  currencyFormatter,
  formatTransactionDate,
} from '@/utils'
import {
  GOAL_STATUS_LABEL_ID,
  goalDeleteMessageDescriptor,
  goalProgress,
  goalProgressFillClassName,
} from '@/utils/goal'
import './GoalItem.scss'

type GoalItemProps = {
  goal: Goal
  isMenuOpen: boolean
  onMenuToggle: (id: string | null) => void
}

const GoalItem = ({ goal, isMenuOpen, onMenuToggle }: GoalItemProps) => {
  const { formatMessage } = useIntl()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()
  const menuRef = useRef<HTMLDivElement>(null)

  const saved = useAppSelector(
    (state) => state.goalsReducer.savedAmounts[goal.id] ?? 0
  )
  const category = useAppSelector((s) =>
    s.categoriesReducer.categories.find((c) => c.id === goal.category_id)
  )
  const { progressPercent, barFill } = goalProgress(saved, goal.target_amount)
  const isTerminal = goal.status === 'spent'

  const closeMenu = useCallback(() => onMenuToggle(null), [onMenuToggle])
  useClickOutside(menuRef, closeMenu, isMenuOpen)

  const handleRowClick = () => navigate(`/goal-detail?id=${goal.id}`)

  const handleRowKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleRowClick()
    }
  }

  const handleMoreOption = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMenuToggle(isMenuOpen ? null : goal.id)
  }

  const handleDelete = () => {
    dispatch(deleteDBGoal(goal.id))
  }

  const handleCancelOrResume = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (goal.status === 'cancelled') {
      dispatch(resumeDBGoal(goal))
    } else {
      dispatch(cancelDBGoal(goal))
    }
  }

  const deleteMessageDescriptor = goalDeleteMessageDescriptor(goal, saved)
  const deleteMessage = formatMessage(
    { id: deleteMessageDescriptor.id },
    deleteMessageDescriptor.values
  )

  const goalItemClassName = combineClassName('goal-item p-4', [
    {
      condition: goal.status === 'cancelled',
      className: 'goal-item--cancelled',
    },
  ])

  const progressFillClassName = goalProgressFillClassName(goal.status)

  const buttonClassName = combineClassName('btn', [
    {
      condition: goal.status === 'cancelled',
      className: 'btn-primary',
    },
    {
      condition: goal.status !== 'cancelled',
      className: 'btn-outline-primary',
    },
  ])

  return (
    <div
      className={goalItemClassName}
      onClick={handleRowClick}
      role="button"
      tabIndex={0}
      aria-label={formatMessage({ id: 'ViewGoalDetail' }, { name: goal.name })}
      onKeyDown={handleRowKeyDown}
    >
      <FormModal.FormGoal
        isOpen={editModal.isOpen}
        data={goal}
        onClose={editModal.close}
        onCancel={editModal.close}
      />

      {deleteModal.isOpen && (
        <DeleteDataModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          title={formatMessage({ id: 'DeleteGoal' })}
          message={deleteMessage}
          handleDelete={handleDelete}
        />
      )}

      <div className="flex-space-between flex-align-center mb-2 gap-2">
        <div className="flex-align-center gap-4">
          {category && (
            <CategoryIcon
              iconId={category.icon_id}
              color={category.color}
              isActive={goal.status !== 'cancelled'}
            />
          )}
          <div className="flex-column">
            <span className="text--bold text--color-primary">{goal.name}</span>
            {!isTerminal && goal.deadline && (
              <span className="text--light text--3 text--italic">
                {formatMessage(
                  { id: 'Due' },
                  { date: formatTransactionDate(goal.deadline) }
                )}
              </span>
            )}
          </div>
        </div>
        <div className="relative flex-align-center gap-2" ref={menuRef}>
          <span className={`pill pill--${goal.status} text--uppercase`}>
            {formatMessage({ id: GOAL_STATUS_LABEL_ID[goal.status] })}
          </span>

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
              handleEdit={
                !isTerminal
                  ? () => {
                      closeMenu()
                      editModal.open()
                    }
                  : undefined
              }
              handleDelete={() => {
                closeMenu()
                deleteModal.open()
              }}
            />
          )}
        </div>
      </div>

      <div className="flex-column gap-2 flex-1">
        <ProgressBar
          amount={barFill}
          label={goal.name}
          options={{
            enableStyle: false,
            progressClassName: progressFillClassName,
          }}
        />

        <div className="flex-space-between flex-align-center">
          <span className="text--light text--3">
            {currencyFormatter(saved)} / {currencyFormatter(goal.target_amount)}
          </span>
          <div className="flex-align-center gap-2">
            <span className="text--light text--3">
              {progressPercent.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {!isTerminal && (
        <div className="flex-end">
          <button
            type="button"
            className={buttonClassName}
            onClick={handleCancelOrResume}
            aria-label={formatMessage({
              id: goal.status === 'cancelled' ? 'ResumeGoal' : 'CancelGoal',
            })}
          >
            {goal.status === 'cancelled' ? (
              <div className="flex-align-center gap-2">
                <PlaySvg
                  className="icon--md icon--color-white"
                  aria-hidden="true"
                />
                <span className="text--3">
                  {formatMessage({ id: 'ResumeGoal' })}
                </span>
              </div>
            ) : (
              <div className="flex-align-center gap-2">
                <SquareSvg
                  className="icon--md icon--color-primary"
                  aria-hidden="true"
                />
                <span className="text--3">
                  {formatMessage({ id: 'CancelGoal' })}
                </span>
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default GoalItem

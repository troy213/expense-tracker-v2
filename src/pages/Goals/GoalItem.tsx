import { useCallback, useMemo, useRef } from 'react'
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
import { savedAmount } from '@/lib/db/goals'
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
import './GoalItem.scss'

const STATUS_LABEL_ID: Record<Goal['status'], string> = {
  in_progress: 'GoalInProgress',
  completed: 'GoalCompleted',
  spent: 'GoalSpent',
  cancelled: 'GoalCancelled',
}

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

  const goalHistory = useAppSelector((state) => state.goalsReducer.history)
  const filteredGoalHistory = useMemo(
    () => goalHistory.filter((e) => e.goal_id === goal.id),
    [goalHistory, goal.id]
  )
  const category = useAppSelector((s) =>
    s.categoriesReducer.categories.find((c) => c.id === goal.category_id)
  )

  const saved = savedAmount(filteredGoalHistory)
  const progressPercent =
    goal.target_amount > 0 ? (saved / goal.target_amount) * 100 : 0
  const barFill = Math.min(progressPercent, 100)
  const isTerminal = goal.status === 'spent'

  const closeMenu = useCallback(() => onMenuToggle(null), [onMenuToggle])
  useClickOutside(menuRef, closeMenu, isMenuOpen)

  const handleRowClick = () => navigate(`/goals/${goal.id}`)

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

  const deleteMessage =
    saved > 0 && goal.status !== 'spent'
      ? formatMessage(
          { id: 'GoalDeleteWithBalance' },
          { amount: currencyFormatter(saved) }
        )
      : formatMessage({ id: 'DeleteDataSpecific' }, { name: goal.name })

  const goalItemClassName = combineClassName('goal-item p-4', [
    {
      condition: goal.status === 'cancelled',
      className: 'goal-item--cancelled',
    },
  ])

  const progressFillClassName = combineClassName('progress-bar__fill--goal', [
    {
      condition: goal.status === 'cancelled',
      className: 'progress-bar__fill--goal-cancelled',
    },
    {
      condition: goal.status === 'completed' || goal.status === 'spent',
      className: 'progress-bar__fill--goal-success',
    },
  ])

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
      onKeyDown={(e) => e.key === 'Enter' && handleRowClick()}
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
            {formatMessage({ id: STATUS_LABEL_ID[goal.status] })}
          </span>

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
                <PlaySvg className="icon--md icon--color-white" />
                <span className="text--3">
                  {formatMessage({ id: 'ResumeGoal' })}
                </span>
              </div>
            ) : (
              <div className="flex-align-center gap-2">
                <SquareSvg className="icon--md icon--color-primary" />
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

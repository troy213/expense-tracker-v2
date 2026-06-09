import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { v7 as uuidv7 } from 'uuid'
import {
  CategoryIcon,
  FormModal,
  Modal,
  Navbar,
  ProgressBar,
} from '@/components'
import DeleteDataModal from '@/components/Modal/DeleteDataModal'
import SpendGoalModal from '@/components/Modal/SpendGoalModal'
import { useAppDispatch, useAppSelector, useDisclosure } from '@/hooks'
import { savedAmount } from '@/lib/db/goals'
import { Goal } from '@/types'
import {
  cancelDBGoal,
  deleteDBGoal,
  resumeDBGoal,
  spendDBGoal,
} from '@/store/goals/goals-thunk'
import { addDBTransactions } from '@/store/transactions/transactions-thunk'
import {
  combineClassName,
  currencyFormatter,
  formatTransactionDate,
  getDate,
} from '@/utils'
import './index.scss'
import {
  ArrowDownSvg,
  ArrowUpSvg,
  CartSvg,
  EditSvg,
  PlaySvg,
  SquareSvg,
  TrashSvg,
} from '@/assets'

const STATUS_LABEL_ID: Record<Goal['status'], string> = {
  in_progress: 'GoalInProgress',
  completed: 'GoalCompleted',
  spent: 'GoalSpent',
  cancelled: 'GoalCancelled',
}

const GoalDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { formatMessage } = useIntl()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const goal = useAppSelector((s) =>
    s.goalsReducer.goals.find((g) => g.id === id)
  )
  const allHistory = useAppSelector((s) => s.goalsReducer.history)
  const goalHistory = useMemo(
    () =>
      allHistory
        .filter((e) => e.goal_id === id)
        .slice()
        .sort(
          (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)
        ),
    [allHistory, id]
  )
  const category = useAppSelector((s) =>
    s.categoriesReducer.categories.find((c) => c.id === goal?.category_id)
  )

  const editModal = useDisclosure()
  const contributeModal = useDisclosure()
  const withdrawModal = useDisclosure()
  const spendModal = useDisclosure()
  const deleteModal = useDisclosure()

  if (!goal) {
    return (
      <div className="flex-column gap-4 p-4">
        <Navbar enableBackButton title="Goals" />
      </div>
    )
  }

  const saved = savedAmount(goalHistory)
  const progressPercent =
    goal.target_amount > 0 ? (saved / goal.target_amount) * 100 : 0
  const barFill = Math.min(progressPercent, 100)
  const isActive = goal.status === 'in_progress' || goal.status === 'completed'
  const isTerminal = goal.status === 'spent'

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

  const daysUntilDeadline = goal.deadline
    ? Math.max(
        1,
        Math.ceil(
          (new Date(goal.deadline).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null
  const remaining = Math.max(0, goal.target_amount - saved)
  const perDay =
    daysUntilDeadline && remaining > 0
      ? Math.ceil(remaining / daysUntilDeadline)
      : null

  const handleSpend = () => {
    const txId = uuidv7()
    dispatch(
      addDBTransactions({
        data: {
          date: getDate(),
          category_id: goal.category_id,
          item: [{ id: txId, description: goal.name, amount: saved }],
        },
      })
    )
    dispatch(spendDBGoal({ goal, linkedTransactionId: txId }))
    spendModal.close()
  }

  const handleDelete = () => {
    dispatch(deleteDBGoal(goal.id))
    navigate('/goals', { replace: true })
  }

  const goalCardClassName = combineClassName('goal-detail__card', [
    {
      condition: goal.status === 'cancelled',
      className: 'goal-detail__card--cancelled',
    },
  ])

  const deleteMessage =
    saved > 0 && goal.status !== 'spent'
      ? formatMessage(
          { id: 'GoalDeleteWithBalance' },
          { amount: currencyFormatter(saved) }
        )
      : formatMessage({ id: 'DeleteDataSpecific' }, { name: goal.name })

  const deleteButtonClassName = combineClassName('btn flex-1 p-4', [
    {
      condition: goal.status === 'spent',
      className: 'btn-danger text--color-white',
    },
    {
      condition: goal.status !== 'spent',
      className: 'flex-space-between flex-column btn-outline-danger',
    },
  ])

  return (
    <div className="goal-detail flex-column gap-6 p-4">
      {/* Modals */}
      <FormModal.FormGoal
        data={goal}
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        onCancel={editModal.close}
      />
      <Modal isOpen={contributeModal.isOpen} onClose={contributeModal.close}>
        <FormModal.FormGoalEntry
          goal={goal}
          type="contribution"
          onCancel={contributeModal.close}
        />
      </Modal>
      <Modal isOpen={withdrawModal.isOpen} onClose={withdrawModal.close}>
        <FormModal.FormGoalEntry
          goal={goal}
          type="withdrawal"
          onCancel={withdrawModal.close}
        />
      </Modal>
      {spendModal.isOpen && (
        <SpendGoalModal
          isOpen={spendModal.isOpen}
          onClose={spendModal.close}
          goalName={goal.name}
          amount={currencyFormatter(saved)}
          handleSpend={handleSpend}
        />
      )}
      {deleteModal.isOpen && (
        <DeleteDataModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          title={formatMessage({ id: 'DeleteGoal' })}
          message={deleteMessage}
          handleDelete={handleDelete}
        />
      )}

      <Navbar enableBackButton title="GoalDetail" />

      {/* Goal summary card */}
      <div className={goalCardClassName}>
        <div className="flex-space-between flex-align-center gap-4">
          <div className="flex-align-center gap-4">
            {category && (
              <CategoryIcon
                iconId={category.icon_id}
                color={category.color}
                isActive={goal.status !== 'cancelled'}
              />
            )}
            <div className="flex-column gap-1">
              <span className="text--bold text--color-primary">
                {goal.name}
              </span>
              {goal.deadline && (
                <span className="text-light text--color-primary text--3">
                  {formatMessage(
                    { id: 'Due' },
                    { date: formatTransactionDate(goal.deadline) }
                  )}
                </span>
              )}
            </div>
          </div>
          <span className={`pill pill--${goal.status}`}>
            {formatMessage({ id: STATUS_LABEL_ID[goal.status] })}
          </span>
        </div>

        <div className="flex-column gap-2">
          <div className="flex-space-between flex-align-end">
            <div className="flex-column">
              <span className="text--bold text--8">
                {currencyFormatter(saved)}
              </span>
              <span className="text--light text--3">
                saved of {currencyFormatter(goal.target_amount)}
              </span>
            </div>
            <span className="text--light text--3">
              {progressPercent.toFixed(0)}%
            </span>
          </div>

          <ProgressBar
            amount={barFill}
            options={{
              enableStyle: false,
              progressClassName: progressFillClassName,
            }}
          />
        </div>

        {perDay && (
          <span className="text--light text--3 text--italic mt-2">
            {formatMessage(
              { id: 'GoalDailyAmount' },
              { amount: currencyFormatter(perDay) }
            )}
          </span>
        )}
      </div>

      {/* Action buttons */}
      {goal.status === 'completed' && (
        <button
          type="button"
          className="btn btn-success flex gap-2 p-4"
          onClick={() => spendModal.open()}
        >
          <CartSvg />
          <span className="text--bold">
            {formatMessage({ id: 'SpendGoal' })}
          </span>
        </button>
      )}

      {isActive && (
        <div className="flex-column gap-2 mt-2">
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-primary flex-1 p-3"
              onClick={() => contributeModal.open()}
            >
              {formatMessage({ id: 'Contribute' })}
            </button>
            <button
              type="button"
              className="btn btn-outline-primary flex-1 p-3"
              onClick={() => withdrawModal.open()}
            >
              {formatMessage({ id: 'Withdraw' })}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {(goal.status === 'in_progress' || goal.status === 'completed') && (
          <button
            type="button"
            className="btn btn-outline-primary flex-space-between flex-column flex-1 p-4"
            onClick={() => dispatch(cancelDBGoal(goal))}
          >
            <SquareSvg className="icon--color-primary icon--md" />
            <span className="text--3 text--light">
              {formatMessage({ id: 'CancelGoal' })}
            </span>
          </button>
        )}

        {goal.status === 'cancelled' && (
          <button
            type="button"
            className="btn btn-outline-primary flex-space-between flex-column flex-1 p-4"
            onClick={() => dispatch(resumeDBGoal(goal))}
          >
            <PlaySvg className="icon--color-primary icon--md" />
            <span className="text--3 text--light">
              {formatMessage({ id: 'ResumeGoal' })}
            </span>
          </button>
        )}
        {!isTerminal && (
          <button
            type="button"
            className="btn btn-outline-primary flex-space-between flex-column flex-1 p-4"
            onClick={() => editModal.open()}
            aria-label={formatMessage({ id: 'EditGoal' })}
          >
            <EditSvg className="icon--color-primary icon--md" />
            <span className="text--3 text--light">
              {formatMessage({ id: 'Edit' })}
            </span>
          </button>
        )}
        <button
          type="button"
          className={deleteButtonClassName}
          onClick={() => deleteModal.open()}
        >
          <TrashSvg className="icon--md" />
          <span className="text--3 text--light">
            {formatMessage({ id: 'DeleteGoal' })}
          </span>
        </button>
      </div>

      {/* History list */}
      <div className="flex-column flex-1 gap-4">
        <span className="text--bold text--color-primary">
          {formatMessage({ id: 'GoalHistory' })}
        </span>
        {goalHistory.length === 0 ? (
          <div className="flex-align-center flex-justify-center flex-1">
            <span className="text--light text--3">
              {formatMessage({ id: 'NoTransaction' })}
            </span>
          </div>
        ) : (
          goalHistory.map((entry) => {
            const historyItemIconClassName = combineClassName(
              'goal-detail__history-item-icon',
              [
                {
                  condition: entry.type === 'contribution',
                  className: 'icon--color-success',
                },
                {
                  condition: entry.type === 'withdrawal',
                  className: 'icon--color-danger',
                },
              ]
            )

            return (
              <div key={entry.id} className="goal-detail__history-item p-4">
                <div className="flex-space-between flex-align-center">
                  <div className="flex-align-center gap-4">
                    <div className={historyItemIconClassName}>
                      {entry.type === 'contribution' ? (
                        <ArrowUpSvg />
                      ) : (
                        <ArrowDownSvg />
                      )}
                    </div>
                    <div className="flex-column gap-1">
                      <span
                        className={
                          entry.type === 'contribution'
                            ? 'text--color-success'
                            : 'text--color-danger'
                        }
                      >
                        {entry.type === 'contribution'
                          ? `+${currencyFormatter(entry.amount)}`
                          : `-${currencyFormatter(entry.amount)}`}
                      </span>
                      <span className="text--light text--3">
                        {formatTransactionDate(entry.date)}
                      </span>
                    </div>
                  </div>
                  <span className="text--light text--3 text--italic">
                    {formatMessage({
                      id:
                        entry.type === 'contribution'
                          ? 'Contribute'
                          : 'Withdraw',
                    })}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default GoalDetail

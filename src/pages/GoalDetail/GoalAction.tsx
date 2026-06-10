import { useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { v7 as uuidv7 } from 'uuid'
import { CartSvg, EditSvg, PlaySvg, SquareSvg, TrashSvg } from '@/assets'
import { FormModal, Modal } from '@/components'
import DeleteDataModal from '@/components/Modal/DeleteDataModal'
import SpendGoalModal from '@/components/Modal/SpendGoalModal'
import { useAppDispatch, useAppSelector, useDisclosure } from '@/hooks'
import {
  cancelDBGoal,
  deleteDBGoal,
  resumeDBGoal,
  spendDBGoal,
} from '@/store/goals/goals-thunk'
import { addDBTransactions } from '@/store/transactions/transactions-thunk'
import { Goal } from '@/types'
import { combineClassName, currencyFormatter, getDate } from '@/utils'
import { goalDeleteMessageDescriptor, isActiveGoal } from '@/utils/goal'

type GoalActionProps = {
  goal: Goal
}

const GoalAction = ({ goal }: GoalActionProps) => {
  const { formatMessage } = useIntl()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { totalSaved: saved } = useAppSelector((s) => s.goalDetailReducer)

  const editModal = useDisclosure()
  const contributeModal = useDisclosure()
  const withdrawModal = useDisclosure()
  const spendModal = useDisclosure()
  const deleteModal = useDisclosure()

  const isActive = isActiveGoal(goal.status)
  const isTerminal = goal.status === 'spent'

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

  const deleteMessageDescriptor = goalDeleteMessageDescriptor(goal, saved)
  const deleteMessage = formatMessage(
    { id: deleteMessageDescriptor.id },
    deleteMessageDescriptor.values
  )

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
    <>
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

      {/* Spend button (completed only) */}
      {goal.status === 'completed' && (
        <button
          type="button"
          className="btn btn-success flex gap-2 p-4"
          onClick={() => spendModal.open()}
        >
          <CartSvg aria-hidden="true" />
          <span className="text--bold">
            {formatMessage({ id: 'SpendGoal' })}
          </span>
        </button>
      )}

      {/* Contribute / Withdraw */}
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

      {/* Cancel / Resume / Edit / Delete */}
      <div className="flex gap-4">
        {isActive && (
          <button
            type="button"
            className="btn btn-outline-primary flex-space-between flex-column flex-1 p-4"
            onClick={() => dispatch(cancelDBGoal(goal))}
          >
            <SquareSvg
              className="icon--color-primary icon--md"
              aria-hidden="true"
            />
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
            <PlaySvg
              className="icon--color-primary icon--md"
              aria-hidden="true"
            />
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
          >
            <EditSvg
              className="icon--color-primary icon--md"
              aria-hidden="true"
            />
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
          <TrashSvg className="icon--md" aria-hidden="true" />
          <span className="text--3 text--light">
            {formatMessage({ id: 'DeleteGoal' })}
          </span>
        </button>
      </div>
    </>
  )
}

export default GoalAction

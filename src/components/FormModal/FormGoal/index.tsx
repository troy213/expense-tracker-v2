import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { v7 as uuidv7 } from 'uuid'
import CategoryIconPreview from '@/components/CategoryIconPreview'
import Form from '@/components/Form'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { Goal } from '@/types'
import { addDBGoal, editDBGoal } from '@/store/goals/goals-thunk'
import { getDate } from '@/utils'
import Modal from '@/components/Modal'

type FormGoalProps = {
  isOpen: boolean
  onClose: () => void
  data?: Goal
  onCancel?: () => void
}

const FormGoal = ({ isOpen, data, onClose, onCancel }: FormGoalProps) => {
  const { formatMessage } = useIntl()
  const dispatch = useAppDispatch()
  const categories = useAppSelector(
    (state) => state.categoriesReducer.categories
  )
  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === 'expense' && c.is_active),
    [categories]
  )

  const initialValue: Goal = data ?? {
    id: uuidv7(),
    name: '',
    target_amount: 0,
    deadline: null,
    category_id: expenseCategories[0]?.id ?? '',
    status: 'in_progress',
    created_at: getDate(),
  }

  const handleSubmit = (formData: Goal) => {
    const goal: Goal = {
      ...formData,
      deadline: formData.deadline || null,
    }

    if (data) {
      dispatch(editDBGoal(goal))
    } else {
      dispatch(addDBGoal(goal))
    }

    onCancel?.()
  }

  if (!isOpen) return

  return (
    <Modal isOpen onClose={onClose}>
      <Form<Goal>
        defaultValues={initialValue}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      >
        <span className="text--bold text--color-primary">
          {formatMessage({ id: data ? 'EditGoal' : 'AddGoal' })}
        </span>
        <Form.Input
          className="flex-1"
          valueKey="name"
          label={formatMessage({ id: 'GoalName' })}
          placeholder={formatMessage({ id: 'GoalName' })}
          required
        />

        <div className="flex-align-center gap-4">
          <CategoryIconPreview />
          <Form.Select
            valueKey="category_id"
            label={formatMessage({ id: 'Category' })}
            options={expenseCategories}
            className="width-100"
            required
          />
        </div>

        <Form.Input
          type="currency"
          valueKey="target_amount"
          label={formatMessage({ id: 'TargetAmountRp' })}
          required
          min={1}
        />

        <Form.Input
          type="date"
          valueKey="deadline"
          label={formatMessage({ id: 'Deadline' })}
          placeholder="yyyy-mm-dd"
        />

        <div className="flex-column gap-4 mt-4">
          <Form.Submit
            label={formatMessage({ id: data ? 'Update' : 'Add' })}
            className="p-4"
          />
          <Form.Cancel />
        </div>
      </Form>
    </Modal>
  )
}

export default FormGoal

import { useIntl } from 'react-intl'
import { v7 as uuidv7 } from 'uuid'
import Form from '@/components/Form'
import { useAppDispatch } from '@/hooks'
import { Goal, GoalHistoryEntry } from '@/types'
import { addDBHistory } from '@/store/goals/goals-thunk'
import { getDate } from '@/utils'

type EntryFormData = {
  amount: number
  date: string
}

type FormGoalEntryProps = {
  goal: Goal
  type: GoalHistoryEntry['type']
  onCancel?: () => void
}

const FormGoalEntry = ({ goal, type, onCancel }: FormGoalEntryProps) => {
  const { formatMessage } = useIntl()
  const dispatch = useAppDispatch()

  const initialValue: EntryFormData = {
    amount: 0,
    date: getDate(),
  }

  const handleSubmit = (formData: EntryFormData) => {
    const entry: GoalHistoryEntry = {
      id: uuidv7(),
      goal_id: goal.id,
      type,
      amount: formData.amount,
      date: formData.date,
    }

    dispatch(addDBHistory({ goal, entry }))
    onCancel?.()
  }

  const titleId = type === 'contribution' ? 'Contribute' : 'Withdraw'

  return (
    <Form<EntryFormData>
      defaultValues={initialValue}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <span className="text--bold text--color-primary">
        {formatMessage({ id: titleId })}
      </span>

      <Form.Input
        type="currency"
        valueKey="amount"
        label={formatMessage({ id: 'AmountRp' })}
        required
        min={1}
      />

      <Form.Input
        type="date"
        valueKey="date"
        label={formatMessage({ id: 'Date' })}
        placeholder="yyyy-mm-dd"
        enableDateNavigation
        required
      />

      <div className="flex-column gap-4 mt-4">
        <Form.Submit label={formatMessage({ id: titleId })} className="p-4" />
        <Form.Cancel />
      </div>
    </Form>
  )
}

export default FormGoalEntry

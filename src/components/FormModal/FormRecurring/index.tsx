import { useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { v7 as uuidv7 } from 'uuid'
import CategoryIconPreview from '@/components/CategoryIconPreview'
import Form from '@/components/Form'
import Modal from '@/components/Modal'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { CategoryType, Recurring } from '@/types'
import {
  addDBRecurring,
  editDBRecurring,
} from '@/store/recurring/recurring-thunk'
import { getDate } from '@/utils'

type RecurringFormValues = {
  id: string
  recurring_name: string
  transaction_name: string
  type: CategoryType
  category_id: string
  amount: number
  due_day: string // text input; validated 1–31, converted on submit
  start_period: string
  active_until: string // '' = indefinite (null on submit)
  is_active: boolean
}

const DUE_DAY_PATTERN = /^([1-9]|[12]\d|3[01])$/
const PERIOD_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/

/** Category picker filtered by the income|expense radio above it. */
const RecurringCategoryField = () => {
  const { formatMessage } = useIntl()
  const { watch, setValue } = useFormContext<RecurringFormValues>()
  const type = watch('type')
  const categoryId = watch('category_id')
  const categories = useAppSelector((s) => s.categoriesReducer.categories)

  const options = useMemo(
    () => categories.filter((c) => c.type === type && c.is_active),
    [categories, type]
  )

  useEffect(() => {
    if (!options.some((c) => c.id === categoryId)) {
      setValue('category_id', options[0]?.id ?? '')
    }
  }, [options, categoryId, setValue])

  return (
    <div className="flex-align-center gap-4">
      <CategoryIconPreview />
      <Form.Select
        valueKey="category_id"
        label={formatMessage({ id: 'Category' })}
        options={options}
        className="width-100"
        required
      />
    </div>
  )
}

type FormRecurringProps = {
  isOpen: boolean
  onClose: () => void
  data?: Recurring
  onCancel?: () => void
}

const FormRecurring = ({
  isOpen,
  data,
  onClose,
  onCancel,
}: FormRecurringProps) => {
  const { formatMessage } = useIntl()
  const dispatch = useAppDispatch()
  const categories = useAppSelector((s) => s.categoriesReducer.categories)

  const initialValue: RecurringFormValues = data
    ? {
        ...data,
        type:
          categories.find((c) => c.id === data.category_id)?.type ?? 'expense',
        due_day: String(data.due_day),
        active_until: data.active_until ?? '',
      }
    : {
        id: uuidv7(),
        recurring_name: '',
        transaction_name: '',
        type: 'expense',
        category_id: '',
        amount: 0,
        due_day: '',
        start_period: getDate().slice(0, 7),
        active_until: '',
        is_active: true,
      }

  const handleSubmit = (formData: RecurringFormValues) => {
    const definition: Recurring = {
      id: formData.id,
      recurring_name: formData.recurring_name,
      transaction_name: formData.transaction_name,
      category_id: formData.category_id,
      amount: formData.amount,
      due_day: Number(formData.due_day),
      start_period: formData.start_period,
      active_until: formData.active_until || null,
      is_active: formData.is_active,
    }

    if (data) {
      dispatch(editDBRecurring({ definition, today: getDate() }))
    } else {
      dispatch(addDBRecurring({ definition, today: getDate() }))
    }

    onCancel?.()
  }

  if (!isOpen) return

  return (
    <Modal isOpen onClose={onClose}>
      <Form<RecurringFormValues>
        defaultValues={initialValue}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      >
        <span className="text--bold text--color-primary">
          {formatMessage({ id: data ? 'EditRecurring' : 'AddRecurring' })}
        </span>

        <Form.Input
          className="flex-1"
          valueKey="recurring_name"
          label={formatMessage({ id: 'RecurringName' })}
          placeholder={formatMessage({ id: 'RecurringName' })}
          required
        />

        <Form.Input
          className="flex-1"
          valueKey="transaction_name"
          label={formatMessage({ id: 'TransactionName' })}
          placeholder={formatMessage({ id: 'Description' })}
          required
        />

        <Form.Radio
          valueKey="type"
          options={[
            { label: formatMessage({ id: 'Income' }), value: 'income' },
            { label: formatMessage({ id: 'Expense' }), value: 'expense' },
          ]}
          required
        />

        <RecurringCategoryField />

        <Form.Input
          type="currency"
          valueKey="amount"
          label={formatMessage({ id: 'AmountRp' })}
          required
          min={1}
        />

        <Form.Input
          valueKey="due_day"
          label={formatMessage({ id: 'DueDay' })}
          placeholder="15"
          pattern={DUE_DAY_PATTERN}
          errorMessage="DueDayError"
          required
        />

        <Form.Input
          valueKey="start_period"
          label={formatMessage({ id: 'StartPeriod' })}
          placeholder="YYYY-MM"
          pattern={PERIOD_PATTERN}
          errorMessage="PeriodFormatError"
          required
        />

        <Form.Input
          valueKey="active_until"
          label={formatMessage({ id: 'ActiveUntil' })}
          placeholder="YYYY-MM"
          pattern={PERIOD_PATTERN}
          errorMessage="PeriodFormatError"
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

export default FormRecurring

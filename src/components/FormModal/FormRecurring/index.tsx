import { useState } from 'react'
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
import RecurringTabType from './RecurringTypeTab'
import { DUE_DAY_PATTERN, PERIOD_PATTERN, RecurringFormValues } from './types'

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
  const defaultCategoryType = data
    ? categories.find((cat) => cat.id === data.category_id)?.type || 'income'
    : 'expense'
  const [categoryType, setCategoryType] =
    useState<CategoryType>(defaultCategoryType)
  const filteredCategories = categories.filter(
    (item) => item.type === categoryType && item.is_active
  )

  const initialValue: RecurringFormValues = data
    ? {
        ...data,
        due_day: String(data.due_day),
        active_until: data.active_until ?? '',
      }
    : {
        id: uuidv7(),
        recurring_name: '',
        transaction_name: '',
        category_id: filteredCategories[0]?.id ?? '',
        amount: 0,
        due_day: '',
        start_period: getDate().slice(0, 7),
        active_until: '',
        is_active: true,
      }

  const selectedCategoryLabel = categories.find(
    (cat) => cat.id === initialValue.category_id
  )?.name

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
      <div className="flex-column gap-4">
        <span className="text--bold text--color-primary">
          {formatMessage({ id: data ? 'EditRecurring' : 'AddRecurring' })}
        </span>

        <RecurringTabType
          categoryType={categoryType}
          setCategoryType={setCategoryType}
        />

        <Form<RecurringFormValues>
          key={categoryType}
          defaultValues={initialValue}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        >
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

          <div className="flex-align-center gap-4">
            <CategoryIconPreview />
            <Form.Select
              valueKey="category_id"
              label="Category"
              options={filteredCategories}
              selectedValue={selectedCategoryLabel}
              className="width-100"
              required
            />
          </div>

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
      </div>
    </Modal>
  )
}

export default FormRecurring

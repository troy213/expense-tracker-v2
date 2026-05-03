import { useIntl } from 'react-intl'
import { v7 as uuidv7 } from 'uuid'
import Form from '@/components/Form'
import { REGEX } from '@/constants'
import { useAppDispatch } from '@/hooks'
import { Category, CategoryType } from '@/types'
import {
  addDBCategory,
  editDBCategory,
} from '@/store/categories/categories-thunk'

type CategoryFormData = Category

type FormCategoryProps = {
  type: CategoryType
  data?: CategoryFormData
  onCancel?: () => void
}

const FormCategory = ({ type, data, onCancel }: FormCategoryProps) => {
  const initialValue: CategoryFormData = {
    id: uuidv7(),
    name: '',
    type,
    budget: 0,
  }
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const getFormTitle = () => {
    let result = ''
    if (data) {
      type === 'income'
        ? (result = formatMessage({ id: 'EditIncomeCategory' }))
        : (result = formatMessage({ id: 'EditExpenseCategory' }))
    } else {
      type === 'income'
        ? (result = formatMessage({ id: 'AddIncomeCategory' }))
        : (result = formatMessage({ id: 'AddExpenseCategory' }))
    }

    return result
  }

  const handleSubmit = (formData: CategoryFormData) => {
    if (data) {
      dispatch(editDBCategory(formData))
    } else {
      dispatch(addDBCategory(formData))
    }

    onCancel?.()
  }

  return (
    <Form<CategoryFormData>
      defaultValues={data ?? initialValue}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <span className="text--bold text--color-primary">{getFormTitle()}</span>
      <Form.Input
        valueKey="name"
        label={formatMessage({ id: 'CategoryName' })}
        placeholder={formatMessage({ id: 'CategoryName' })}
        pattern={REGEX.COMMON_TEXT.PATTERN}
        errorMessage={REGEX.COMMON_TEXT.ERROR_MESSAGE}
        required
      />
      {type === 'expense' && (
        <Form.Input
          type="currency"
          valueKey="budget"
          label={formatMessage({ id: 'BudgetRp' })}
        />
      )}

      <div className="flex-column gap-4 mt-4">
        <Form.Submit label={data ? 'Save' : 'Add Category'} className="p-4" />
        <Form.Cancel />
      </div>
    </Form>
  )
}

export default FormCategory

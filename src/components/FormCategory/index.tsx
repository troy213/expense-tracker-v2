import { useState } from 'react'
import { useIntl } from 'react-intl'
import { v7 as uuidv7 } from 'uuid'
import { ICON_COLORS } from '@/assets/categories-icons'
import { CategoryIcon, ColorPicker, Form, IconPicker } from '@/components'
import { REGEX } from '@/constants'
import { useAppDispatch } from '@/hooks'
import { Category, CategoryIconId, CategoryType } from '@/types'
import {
  addDBCategory,
  editDBCategory,
} from '@/store/categories/categories-thunk'
import './index.scss'

type CategoryFormData = Category

type FormCategoryProps = {
  type: CategoryType
  data?: CategoryFormData
  onCancel?: () => void
}

const FormCategory = ({ type, data, onCancel }: FormCategoryProps) => {
  const defaultIcon: CategoryIconId = type === 'income' ? 'income' : 'expense'
  const defaultColor = type === 'income' ? ICON_COLORS[0] : ICON_COLORS[1]

  const [selectedIcon, setSelectedIcon] = useState<CategoryIconId>(
    data?.icon_id ?? defaultIcon
  )
  const [selectedColor, setSelectedColor] = useState<string>(
    data?.color ?? defaultColor
  )

  const initialValue: CategoryFormData = {
    id: uuidv7(),
    name: '',
    type,
    budget: 0,
    icon_id: selectedIcon,
    color: selectedColor,
  }

  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const getFormTitle = () => {
    let result = ''
    if (data) {
      type === 'income'
        ? (result = 'EditIncomeCategory')
        : (result = 'EditExpenseCategory')
    } else {
      type === 'income'
        ? (result = 'AddIncomeCategory')
        : (result = 'AddExpenseCategory')
    }

    return result
  }

  const handleSubmit = (formData: CategoryFormData) => {
    const payload = { ...formData, icon_id: selectedIcon, color: selectedColor }

    if (data) {
      dispatch(editDBCategory(payload))
    } else {
      dispatch(addDBCategory(payload))
    }

    onCancel?.()
  }

  return (
    <Form<CategoryFormData>
      defaultValues={data ?? initialValue}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <span className="text--bold text--color-primary">
        {formatMessage({ id: getFormTitle() })}
      </span>
      <div className="flex-align-center gap-4">
        <CategoryIcon
          iconId={selectedIcon ?? defaultIcon}
          color={selectedColor}
        />
        <Form.Input
          className="flex-1"
          valueKey="name"
          label={formatMessage({ id: 'CategoryName' })}
          placeholder={formatMessage({ id: 'CategoryName' })}
          pattern={REGEX.COMMON_TEXT.PATTERN}
          errorMessage={REGEX.COMMON_TEXT.ERROR_MESSAGE}
          required
        />
      </div>
      {type === 'expense' && (
        <Form.Input
          type="currency"
          valueKey="budget"
          label={formatMessage({ id: 'BudgetRp' })}
        />
      )}

      <ColorPicker selectedColor={selectedColor} onChange={setSelectedColor} />
      <IconPicker
        selectedIcon={selectedIcon}
        selectedColor={selectedColor}
        onChange={setSelectedIcon}
      />

      <div className="flex-column gap-4 mt-4">
        <Form.Submit label={data ? 'Save' : 'Add Category'} className="p-4" />
        <Form.Cancel />
      </div>
    </Form>
  )
}

export default FormCategory

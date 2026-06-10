import { useState } from 'react'
import { useIntl } from 'react-intl'
import { v7 as uuidv7 } from 'uuid'
// Import siblings directly (not via the `@/components` barrel) to avoid a
// circular dependency: the barrel imports FormModal, which would otherwise
// import the barrel back. Harmless in one bundle, but breaks chunk execution
// order once routes are code-split.
import CategoryIcon from '@/components/CategoryIcon'
import ColorPicker from '@/components/ColorPicker'
import Form from '@/components/Form'
import IconPicker from '@/components/IconPicker'
import { REGEX } from '@/constants'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { Category, CategoryIconId, CategoryType } from '@/types'
import {
  addDBCategory,
  editDBCategory,
} from '@/store/categories/categories-thunk'
import { getDefaultCategoryIconColor } from '@/utils'
import './index.scss'
import Modal from '@/components/Modal'

type CategoryFormData = Category

type FormCategoryProps = {
  type: CategoryType
  isOpen: boolean
  onClose: () => void
  data?: CategoryFormData
  onCancel?: () => void
}

const FormCategory = ({
  type,
  isOpen,
  data,
  onClose,
  onCancel,
}: FormCategoryProps) => {
  const defaultIcon: CategoryIconId = type === 'income' ? 'income' : 'expense'
  const defaultColor = getDefaultCategoryIconColor(type)
  const lastIndex = useAppSelector((state) =>
    Math.max(
      ...state.categoriesReducer.categories
        .filter((c) => c.type === type)
        .map((c) => c.index)
    )
  )

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
    is_active: true,
    index: lastIndex + 1,
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

  if (!isOpen) return

  return (
    <Modal isOpen onClose={onClose}>
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
            isActive={true}
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

        <ColorPicker
          selectedColor={selectedColor}
          onChange={setSelectedColor}
        />
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
    </Modal>
  )
}

export default FormCategory

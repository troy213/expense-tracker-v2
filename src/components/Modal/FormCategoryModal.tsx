import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'
import { REGEX } from '@/constants'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { categoriesAction } from '@/store/categories/categories-slice'
import { Category, CategoryType } from '@/types'
import { validateEmptyForm } from '@/utils/formUtils'
import Modal from '.'
import Form from '../Form'

type FormCategoryModalProps = {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  selectedCategory: CategoryType
  selectedId?: string
}

type CategoryForm = {
  name: string
  budget?: number
}

type ErrorState = Record<keyof CategoryForm, string>

const dataInitialValue = {
  name: '',
  budget: 0,
}
const errorInitialValue = {
  name: '',
  budget: '',
}

const FormCategoryModal: React.FC<FormCategoryModalProps> = ({
  isOpen,
  setIsOpen,
  selectedCategory,
  selectedId = '',
}) => {
  const isEditForm = selectedId !== ''
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const [data, setData] = useState<CategoryForm>(dataInitialValue)
  const [error, setError] = useState<ErrorState>(errorInitialValue)
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const getFormTitle = () => {
    let result = ''
    if (isEditForm) {
      selectedCategory === 'income'
        ? (result = formatMessage({ id: 'EditIncomeCategory' }))
        : (result = formatMessage({ id: 'EditExpenseCategory' }))
    } else {
      selectedCategory === 'income'
        ? (result = formatMessage({ id: 'AddIncomeCategory' }))
        : (result = formatMessage({ id: 'AddExpenseCategory' }))
    }

    return result
  }

  const handleChange = <K extends keyof CategoryForm>(
    key: K,
    value: CategoryForm[K]
  ) => {
    setData((prevState) => ({
      ...prevState,
      [key]: value,
    }))
    handleError(key, '')
  }

  const handleError = <K extends keyof ErrorState>(
    key: K,
    value: ErrorState[K]
  ) => {
    setError((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let formIsValid = validateEmptyForm(data, categories, setError, {
      isRequired: ['name', 'budget'],
      uniqueDataKey: isEditForm ? [] : ['name'],
    })

    Object.entries(error).forEach(([, value]) => {
      if (value) formIsValid = false
    })

    if (formIsValid) {
      const newCategory: Category = {
        id: selectedId || uuidv4(),
        type: selectedCategory,
        name: data.name.trim(),
        budget: data.budget,
      }

      if (isEditForm) {
        dispatch(categoriesAction.updateCategories(newCategory))
      } else {
        dispatch(categoriesAction.setCategories([...categories, newCategory]))
      }
      handleCancel(e)
    }
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault()
    setData(dataInitialValue)
    setError(errorInitialValue)
    setIsOpen(false)
  }

  useEffect(() => {
    if (isOpen && selectedId) {
      const selectedData = categories.find(
        (category) => category.id === selectedId
      )
      const newData = {
        name: selectedData?.name ?? '',
        budget: selectedData?.budget ?? 0,
      }
      setData(newData)
    } else {
      setData(dataInitialValue)
    }
    setError(errorInitialValue)
  }, [isOpen, selectedId, categories])

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <form className="input-category-modal" onSubmit={handleSubmit}>
        <span className="text--bold text--color-primary">{getFormTitle()}</span>
        <Form.Input
          type="text"
          id="category"
          label={formatMessage({ id: 'CategoryName' })}
          value={data.name}
          onChange={(val) => handleChange('name', val)}
          errorMessage={error.name}
          setError={(val) => handleError('name', val)}
          pattern={REGEX.COMMON_TEXT.PATTERN}
          patternErrorMessage={formatMessage({
            id: REGEX.COMMON_TEXT.ERROR_MESSAGE,
          })}
        />
        {selectedCategory === 'expense' && (
          <Form.Input
            type="currency"
            id="budget"
            label={formatMessage({ id: 'BudgetRp' })}
            value={data.budget ?? 0}
            onChange={(val) => handleChange('budget', Number(val))}
            errorMessage={error.budget}
            setError={(val) => handleError('budget', val)}
            pattern={REGEX.NUMBER.PATTERN}
            patternErrorMessage={formatMessage({
              id: REGEX.NUMBER.ERROR_MESSAGE,
            })}
          />
        )}
        <div className="flex-column gap-4 mt-4">
          <button type="submit" className="btn btn-primary">
            {formatMessage({ id: isEditForm ? 'Edit' : 'Add' })}
          </button>
          <button className="btn btn-outline-primary" onClick={handleCancel}>
            {formatMessage({ id: 'Cancel' })}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default FormCategoryModal

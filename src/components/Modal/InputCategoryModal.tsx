import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuidv4 } from 'uuid'
import { REGEX } from '@/constants'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { categoriesAction } from '@/store/categories/categories-slice'
import { Category, CategoryType } from '@/types'
import Modal from '.'
import Form from '../Form'

type InputCategoryModalProps = {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  selectedCategory: CategoryType
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

const InputCategoryModal: React.FC<InputCategoryModalProps> = ({
  isOpen,
  setIsOpen,
  selectedCategory,
}) => {
  const [data, setData] = useState<CategoryForm>(dataInitialValue)
  const [error, setError] = useState<ErrorState>(errorInitialValue)
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const formTitle =
    selectedCategory === 'income'
      ? formatMessage({ id: 'AddIncomeCategory' })
      : formatMessage({ id: 'AddExpenseCategory' })

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
    let formIsValid = true

    const isExist =
      categories.findIndex((val) => val.name === data.name.trim()) >= 0

    if (isExist) {
      handleError('name', 'Category is already exist')
      formIsValid = false
    }

    Object.entries(data).forEach(([key, value]) => {
      const typedKey = key as keyof CategoryForm

      if (value === '') {
        formIsValid = false
        setError((prevState) => ({
          ...prevState,
          [typedKey]: 'This field cannot be empty',
        }))
      }

      if (error[typedKey]) {
        formIsValid = false
      }
    })

    if (formIsValid) {
      const newCategory: Category = {
        id: uuidv4(),
        type: selectedCategory,
        name: data.name.trim(),
        budget: data.budget,
      }

      dispatch(categoriesAction.setCategories([...categories, newCategory]))
      handleCancel(e)
    }
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault()
    setData(dataInitialValue)
    setError(errorInitialValue)
    setIsOpen(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <form className="input-category-modal" onSubmit={handleSubmit}>
        <span className="text--bold text--color-primary">{formTitle}</span>
        <Form.Input
          type="text"
          id="category"
          label={formatMessage({ id: 'CategoryName' })}
          value={data.name}
          onChange={(val) => handleChange('name', val)}
          errorMessage={error.name}
          setError={(val) => handleError('name', val)}
          pattern={REGEX.ALPHA_NUMERIC}
          patternErrorMessage="Only alphanumeric characters allowed"
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
            pattern={REGEX.NUMBER}
            patternErrorMessage="Only numeric characters allowed"
          />
        )}
        <div className="flex-column gap-4 mt-4">
          <button type="submit" className="btn btn-primary">
            {formatMessage({ id: 'Add' })}
          </button>
          <button className="btn btn-outline-primary" onClick={handleCancel}>
            {formatMessage({ id: 'Cancel' })}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default InputCategoryModal

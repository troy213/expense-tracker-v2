import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Form } from '@/components'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { addDBTransactions, editDBTransactions } from '@/store/main/main-thunk'
import { CategoryType, TxFormData } from '@/types'
import { getDate, makeEmptyTransactionItem } from '@/utils'
import RemainingBudget from './RemainingBudget'
import TransactionItems from './TransactionItem'
import './index.scss'

type FormTransactionProps = {
  data?: TxFormData
  index?: number
  onCancel?: () => void
}

const FormTransaction = ({ data, index, onCancel }: FormTransactionProps) => {
  const { formatMessage } = useIntl()
  const categories = useAppSelector(
    (state) => state.categoriesReducer.categories
  )
  const defaultCategoryType = data
    ? categories.find((cat) => cat.id === data.category_id)?.type || 'income'
    : 'income'
  const [categoryType, setCategoryType] =
    useState<CategoryType>(defaultCategoryType)
  const filteredCategories = categories.filter(
    (item) => item.type === categoryType
  )
  const dispatch = useAppDispatch()

  const editingItemIds = useMemo(
    () => data?.item.map((item) => item.id),
    [data]
  )

  if (filteredCategories.length === 0) {
    return (
      <div className="transaction-empty">
        <div className="flex-column gap-2">
          <span className="text--bold text--color-primary">
            {formatMessage({ id: 'AddTransaction' })}
          </span>
          <span className="text--light text--color-primary text--3">
            {formatMessage({ id: 'NoCategoryWarningMessage' })}
          </span>
          <Link to={`/categories?cat=${categoryType}`} onClick={onCancel}>
            <span className="text--underline text--color-primary text--3">
              {formatMessage({ id: 'AddCategory' })}
            </span>
          </Link>
        </div>
      </div>
    )
  }

  const initialValue: TxFormData = data ?? {
    date: getDate(),
    category_id: filteredCategories[0].id,
    item: [makeEmptyTransactionItem()],
  }

  const selectedCategoryLabel = categories.find(
    (cat) => cat.id === initialValue.category_id
  )?.name

  const handleSubmit = (formData: TxFormData) => {
    if (data && index !== undefined) {
      dispatch(
        editDBTransactions({
          data: formData,
          oldDate: data.date,
          oldCategoryId: data.category_id,
          index,
        })
      )
    } else {
      dispatch(addDBTransactions({ data: formData }))
    }

    if (onCancel) {
      onCancel()
    }
  }

  return (
    <div className="flex-column gap-4">
      <span className="text--bold text--color-primary">
        {formatMessage({
          id: `${data ? 'EditTransaction' : 'AddTransaction'}`,
        })}
      </span>
      <div className="flex-column gap-2">
        <span className="text--color-primary text--light text--3">
          {formatMessage({ id: 'Transaction' })}
        </span>
        <div className="flex gap-4">
          {(['income', 'expense'] as CategoryType[]).map((value) => (
            <label key={value} className="flex-align-center gap-2 width-100">
              <input
                type="radio"
                name="transaction-type"
                value={value}
                checked={categoryType === value}
                onChange={() => setCategoryType(value)}
              />
              <span className="text--color-primary text--capitalize">
                {formatMessage({
                  id: value === 'income' ? 'Income' : 'Expense',
                })}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Form<TxFormData>
        key={categoryType}
        defaultValues={initialValue}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      >
        <div className="flex-column gap-4">
          <div className="flex-column">
            <Form.Input
              type="date"
              valueKey="date"
              label="Date"
              placeholder="yyyy-mm-dd"
              enableDateNavigation
              required
            />
            <Form.Select
              valueKey="category_id"
              label="Category"
              options={filteredCategories}
              selectedValue={selectedCategoryLabel}
              required
            />
          </div>

          <RemainingBudget editingItemIds={editingItemIds} />
          <TransactionItems />

          <Form.Submit
            label={formatMessage({ id: data ? 'Update' : 'Submit' })}
            className="mt-4 p-4"
          />
          <Form.Cancel />
        </div>
      </Form>
    </div>
  )
}

export default FormTransaction

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Form } from '@/components'
import { useAppDispatch, useAppSelector } from '@/hooks'
import {
  addDBTransactions,
  editDBTransactions,
} from '@/store/transactions/transactions-thunk'
import { CategoryType, TxFormData } from '@/types'
import { combineClassName, getDate, makeEmptyTransactionItem } from '@/utils'
import CategoryIconPreview from './CategoryIconPreview'
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
    : 'expense'
  const [categoryType, setCategoryType] =
    useState<CategoryType>(defaultCategoryType)
  const filteredCategories = categories.filter(
    (item) => item.type === categoryType && item.is_active
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
        <div
          className="transaction-type-tabs"
          role="tablist"
          aria-label={formatMessage({ id: 'Transaction' })}
        >
          {(['income', 'expense'] as CategoryType[]).map((value) => {
            const tabItemClassName = combineClassName(
              'transaction-type-tabs__tab',
              [
                {
                  condition: categoryType === value,
                  className: 'selected',
                },
              ]
            )

            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={categoryType === value}
                className={tabItemClassName}
                onClick={() => setCategoryType(value)}
              >
                {formatMessage({
                  id: value === 'income' ? 'Income' : 'Expense',
                })}
              </button>
            )
          })}
        </div>
      </div>

      <Form<TxFormData>
        key={categoryType}
        defaultValues={initialValue}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      >
        <div className="flex-column gap-4">
          <Form.Input
            type="date"
            valueKey="date"
            label="Date"
            placeholder="yyyy-mm-dd"
            enableDateNavigation
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

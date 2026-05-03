import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { v7 as uuidv7 } from 'uuid'
import Form from '@/components/Form'
import { CrossSvg, PlusSvg } from '@/assets'
import { REGEX } from '@/constants'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { CategoryType, TxFormData } from '@/types'
import { getDate } from '@/utils'
import { addDBTransactions, editDBTransactions } from '@/store/main/main-thunk'

type FormTransactionProps = {
  data?: TxFormData
  index?: number
  onCancel?: () => void
}

const makeEmptyItem = () => ({
  id: uuidv7(),
  description: '',
  amount: 0,
})

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
    item: [makeEmptyItem()],
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
              <span className="text--color-primary">{value}</span>
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
          <Form.Input
            type="date"
            valueKey="date"
            label="Date"
            placeholder="yyyy-mm-dd"
            required
          />
          <Form.Select
            valueKey="category_id"
            label="Category"
            options={filteredCategories}
            selectedValue={selectedCategoryLabel}
            required
          />

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

const TransactionItems = () => {
  const { control } = useFormContext<TxFormData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'item',
  })
  const { formatMessage } = useIntl()

  return (
    <div className="form-transaction-items">
      {fields.map((field, index) => (
        <div key={field.id} className="form-transaction-items__item">
          <div className="flex-space-between">
            <span className="text--color-primary">
              {formatMessage(
                { id: 'TransactionDetailNo' },
                { index: index + 1 }
              )}
            </span>
            {fields.length > 1 && (
              <button
                className="btn btn-clear"
                onClick={() => {
                  remove(index)
                }}
              >
                <CrossSvg className="icon icon--stroke-primary" />
              </button>
            )}
          </div>
          <Form.Input
            valueKey={`item.${index}.description`}
            label={formatMessage({ id: 'Description' })}
            placeholder={formatMessage({ id: 'Description' })}
            pattern={REGEX.COMMON_TEXT.PATTERN}
            errorMessage={REGEX.COMMON_TEXT.ERROR_MESSAGE}
            required
          />
          <Form.Input
            valueKey={`item.${index}.amount`}
            type="currency"
            label={formatMessage({ id: 'AmountRp' })}
            required
          />
        </div>
      ))}
      <button
        type="button"
        className="btn btn-dashed p-4"
        onClick={() => append(makeEmptyItem())}
      >
        <PlusSvg className="icon--stroke-primary" />
        <span className="text--color-primary text--light text--3">
          {formatMessage({ id: 'AddMoreTransaction' })}
        </span>
      </button>
    </div>
  )
}

export default FormTransaction

import { useFieldArray, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { CrossSvg, PlusSvg } from '@/assets'
import Form from '@/components/Form'
import { REGEX } from '@/constants'
import { TxFormData } from '@/types'
import { makeEmptyTransactionItem } from '@/utils'
import './TransactionItem.scss'

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
            <span className="text--color-primary text--bold text--3">
              {formatMessage(
                { id: 'TransactionDetailNo' },
                { index: index + 1 }
              )}
            </span>
            {fields.length > 1 && (
              <button
                type="button"
                className="btn btn-clear"
                onClick={() => {
                  remove(index)
                }}
                aria-label={formatMessage({ id: 'Delete' })}
              >
                <CrossSvg className="icon icon--color-primary" />
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
        onClick={() => append(makeEmptyTransactionItem())}
      >
        <PlusSvg className="icon--color-primary" />
        <span className="text--color-primary text--light text--3">
          {formatMessage({ id: 'AddMoreTransaction' })}
        </span>
      </button>
    </div>
  )
}

export default TransactionItems

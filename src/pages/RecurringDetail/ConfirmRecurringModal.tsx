import { useIntl } from 'react-intl'
import Form from '@/components/Form'
import Modal from '@/components/Modal'
import { useAppDispatch } from '@/hooks'
import { RecurringHistoryEntry } from '@/types'
import { resolveAddDBRecurring } from '@/store/recurring/recurring-thunk'

type ConfirmRecurringModalProps = {
  row: RecurringHistoryEntry
  recurringName: string
  isOpen: boolean
  onClose: () => void
}

const ConfirmRecurringModal = ({
  row,
  recurringName,
  isOpen,
  onClose,
}: ConfirmRecurringModalProps) => {
  const { formatMessage, formatDate } = useIntl()
  const dispatch = useAppDispatch()

  const handleSubmit = (formData: { name: string; amount: number }) => {
    dispatch(
      resolveAddDBRecurring({
        row,
        amount: formData.amount,
        name: formData.name,
      })
    )
    onClose()
  }

  if (!isOpen) return

  return (
    <Modal isOpen onClose={onClose}>
      <Form<{ name: string; amount: number }>
        defaultValues={{ name: row.transaction_name, amount: row.amount }}
        onSubmit={handleSubmit}
        onCancel={onClose}
      >
        <span className="text--bold text--color-primary">{recurringName}</span>
        <span className="text--light text--3">
          {/* timeZone UTC: keep the label on the row's stored month
              regardless of the viewer's timezone. */}
          {formatDate(row.date, {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
          })}
        </span>

        <Form.Input
          type="text"
          valueKey="name"
          label={formatMessage({ id: 'TransactionName' })}
          required
        />

        <Form.Input
          type="currency"
          valueKey="amount"
          label={formatMessage({ id: 'AmountRp' })}
          required
          min={1}
        />

        <div className="flex-column gap-4 mt-4">
          <Form.Submit label={formatMessage({ id: 'Add' })} className="p-4" />
          <Form.Cancel />
        </div>
      </Form>
    </Modal>
  )
}

export default ConfirmRecurringModal

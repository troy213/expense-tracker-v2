import { useIntl } from 'react-intl'
import { useAppDispatch, useDisclosure } from '@/hooks'
import { RecurringHistoryEntry, RecurringStatus } from '@/types'
import { resolveSkipDBRecurring } from '@/store/recurring/recurring-thunk'
import { combineClassName, currencyFormatter } from '@/utils'
import ConfirmRecurringModal from './ConfirmRecurringModal'

const STATUS_LABEL_ID: Record<RecurringStatus, string> = {
  pending: 'RecurringPending',
  added: 'RecurringAdded',
  skipped: 'RecurringSkipped',
}

type RecurringHistoryItemProps = {
  row: RecurringHistoryEntry
  recurringName: string
}

const RecurringHistoryItem = ({
  row,
  recurringName,
}: RecurringHistoryItemProps) => {
  const { formatMessage, formatDate } = useIntl()
  const dispatch = useAppDispatch()
  const confirmModal = useDisclosure()

  const isPending = row.status === 'pending'

  const itemClassName = combineClassName('recurring-history-item p-4', [
    { condition: isPending, className: 'recurring-history-item--pending' },
  ])

  return (
    <div className={itemClassName}>
      {confirmModal.isOpen && (
        <ConfirmRecurringModal
          row={row}
          recurringName={recurringName}
          isOpen={confirmModal.isOpen}
          onClose={confirmModal.close}
        />
      )}

      <div className="flex-space-between flex-align-center gap-2">
        <div className="flex-column">
          <span className="text--bold text--color-primary">
            {formatDate(row.date, { month: 'long', year: 'numeric' })}
          </span>
          <span className="text--light text--3">
            {currencyFormatter(row.amount)}
          </span>
        </div>
        <span className={`pill pill--${row.status} text--uppercase`}>
          {formatMessage({ id: STATUS_LABEL_ID[row.status] })}
        </span>
      </div>

      {isPending && (
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            className="btn btn-primary flex-1 p-3"
            onClick={() => confirmModal.open()}
          >
            {formatMessage({ id: 'Add' })}
          </button>
          <button
            type="button"
            className="btn btn-outline-primary flex-1 p-3"
            onClick={() => dispatch(resolveSkipDBRecurring(row))}
          >
            {formatMessage({ id: 'Skip' })}
          </button>
        </div>
      )}
    </div>
  )
}

export default RecurringHistoryItem

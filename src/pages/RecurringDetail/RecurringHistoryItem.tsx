import { useIntl } from 'react-intl'
import { useAppDispatch, useDisclosure } from '@/hooks'
import { RecurringHistoryEntry } from '@/types'
import { resolveSkipDBRecurring } from '@/store/recurring/recurring-thunk'
import { combineClassName, currencyFormatter } from '@/utils'
import ConfirmRecurringModal from './ConfirmRecurringModal'
import { CheckSvg, ForbiddenSvg } from '@/assets'

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
    {
      condition: row.status === 'skipped',
      className: 'recurring-history-item--skipped',
    },
    {
      condition: row.status === 'added',
      className: 'recurring-history-item--added',
    },
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
        <div className="flex-align-center gap-4">
          {row.status === 'skipped' && (
            <ForbiddenSvg className="recurring-history-item__icon" />
          )}
          {row.status === 'added' && (
            <CheckSvg className="recurring-history-item__icon" />
          )}
          <div className="flex-column gap-1">
            <span className="text--bold">{row.transaction_name}</span>
            <span className="text--light text--3">
              {/* timeZone UTC: 'YYYY-MM-DD' parses as UTC midnight; local
                rendering west of UTC would label day-1 dates with the
                previous month. */}
              {formatDate(row.date, {
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              })}
            </span>
          </div>
        </div>
        <span className="text--bold">{currencyFormatter(row.amount)}</span>
      </div>

      {isPending && (
        <div className="flex-end gap-2 mt-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => confirmModal.open()}
          >
            {formatMessage({ id: 'Add' })}
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
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

import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Navbar } from '@/components'
import { useAppSelector } from '@/hooks'
import RecurringItem from '@/pages/Recurring/RecurringItem'
import RecurringHistoryItem from './RecurringHistoryItem'
import './index.scss'

const RecurringDetail = () => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const { formatMessage } = useIntl()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const definition = useAppSelector((s) =>
    s.recurringReducer.recurring.find((d) => d.id === id)
  )
  const history = useAppSelector((s) => s.recurringReducer.history)

  // Pending months on top (oldest first — the catch-up queue), resolved below
  // (newest first).
  const rows = useMemo(() => {
    const own = history.filter((r) => r.recurring_id === id)
    const pending = own
      .filter((r) => r.status === 'pending')
      .sort((a, b) => a.date.localeCompare(b.date))
    const resolved = own
      .filter((r) => r.status !== 'pending')
      .sort((a, b) => b.date.localeCompare(a.date))
    return [...pending, ...resolved]
  }, [history, id])

  if (!id || !definition) {
    return (
      <div className="recurring-detail flex-column gap-4 p-4">
        <Navbar enableBackButton title="RecurringDetail" />
        <div className="flex-align-center flex-justify-center flex-1">
          <span className="text--light text--3">
            {formatMessage({ id: 'NoRecurringDetail' })}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="recurring-detail flex-column gap-4 p-4">
      <Navbar enableBackButton title="RecurringDetail" />

      <RecurringItem
        definition={definition}
        isMenuOpen={openMenuId === definition.id}
        onMenuToggle={setOpenMenuId}
      />

      <div className="flex-column gap-3">
        {rows.map((row) => (
          <RecurringHistoryItem
            key={row.id}
            row={row}
            recurringName={definition.recurring_name}
          />
        ))}
      </div>
    </div>
  )
}

export default RecurringDetail

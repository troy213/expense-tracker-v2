import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { AlertCircleSvg, AlertTriangleSvg } from '@/assets'
import { ProgressBar } from '@/components'
import dbServices from '@/lib/db'
import { useAppSelector } from '@/hooks'
import { TxFormData } from '@/types'
import {
  calculatePercentage,
  combineClassName,
  currencyFormatter,
  getDate,
  getMonthRange,
} from '@/utils'
import './RemainingBudget.scss'

type RemainingBudgetProps = {
  editingItemIds?: string[]
}

const RemainingBudget = ({ editingItemIds }: RemainingBudgetProps) => {
  const categories = useAppSelector(
    (state) => state.categoriesReducer.categories
  )
  const { watch } = useFormContext<TxFormData>()
  const { formatMessage } = useIntl()

  const categoryId = watch('category_id')
  const date = watch('date')
  const items = watch('item')

  const category = categories.find((cat) => cat.id === categoryId)
  const categoryBudget = category?.budget ?? 0
  const hasBudget = categoryBudget > 0

  const [monthExpenses, setMonthExpenses] = useState(0)
  const editingKey = editingItemIds?.join(',') ?? ''

  useEffect(() => {
    if (!categoryId || !hasBudget) {
      setMonthExpenses(0)
      return
    }

    let active = true
    const excluded = new Set(editingKey ? editingKey.split(',') : [])
    const { firstDate, lastDate } = getMonthRange(date || getDate())

    dbServices.transactions
      .getTransactionsByCategoryAndDateRange(categoryId, firstDate, lastDate)
      .then((transactions) => {
        if (!active) return
        const total = transactions
          .filter((tx) => !excluded.has(tx.id))
          .reduce((sum, tx) => sum + tx.amount, 0)
        setMonthExpenses(total)
      })

    return () => {
      active = false
    }
  }, [categoryId, date, hasBudget, editingKey])

  if (!category || !hasBudget) return null

  const currentItemExpenses = (items ?? []).reduce(
    (total, item) => total + (Number(item.amount) || 0),
    0
  )
  const remainingBudget = categoryBudget - monthExpenses - currentItemExpenses

  const isExceeded = remainingBudget <= 0
  const isWarning = !isExceeded && remainingBudget < categoryBudget * 0.25

  const percentage = calculatePercentage(remainingBudget, categoryBudget)
  const progress = Math.min(100, Math.max(0, percentage))

  const budgetClassName = combineClassName(
    'text--color-primary text--light text--3',
    [
      { condition: isWarning, className: 'text--color-warning' },
      { condition: isExceeded, className: 'text--color-danger' },
    ]
  )

  return (
    <div className="remaining-budget">
      <div className="flex-align-center gap-2">
        <span className="text--color-primary text--light text--3">
          {formatMessage({ id: 'RemainingBudgetForThisCategory' })}
        </span>
      </div>
      <ProgressBar amount={progress} />
      <div className="flex-space-between gap-2">
        <span className={budgetClassName}>
          {currencyFormatter(remainingBudget)}
        </span>
        <div className="flex-align-center gap-1">
          {isWarning && (
            <AlertTriangleSvg className="icon--sm icon--stroke-warning" />
          )}
          {isExceeded && (
            <AlertCircleSvg className="icon--sm icon--stroke-danger" />
          )}
          <span className={budgetClassName}>
            {calculatePercentage(remainingBudget, categoryBudget)}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default RemainingBudget

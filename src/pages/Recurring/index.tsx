import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { PlusSvg } from '@/assets'
import { FormModal, Navbar, Widget } from '@/components'
import { useAppSelector, useDisclosure } from '@/hooks'
import { currencyFormatter } from '@/utils'
import RecurringItem from './RecurringItem'
import './index.scss'

const Recurring = () => {
  const { formatMessage } = useIntl()
  const addModal = useDisclosure()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const recurring = useAppSelector((s) => s.recurringReducer.recurring)
  const categories = useAppSelector((s) => s.categoriesReducer.categories)

  const { totalIncome, totalExpense } = useMemo(() => {
    const categoryTypeMap = new Map(categories.map((c) => [c.id, c.type]))
    return recurring
      .filter((d) => d.is_active)
      .reduce(
        (acc, d) => {
          if (categoryTypeMap.get(d.category_id) === 'income') {
            acc.totalIncome += d.amount
          } else {
            acc.totalExpense += d.amount
          }
          return acc
        },
        { totalIncome: 0, totalExpense: 0 }
      )
  }, [recurring, categories])

  return (
    <div className="recurring">
      <FormModal.FormRecurring
        isOpen={addModal.isOpen}
        onClose={addModal.close}
        onCancel={addModal.close}
      />

      <div className="flex-column flex-1 gap-4 p-4">
        <Navbar enableBackButton title="Recurring" />

        <div className="flex gap-4">
          <Widget>
            <div className="flex-column flex-align-center flex-1">
              <span className="text--light text--3">
                {formatMessage({ id: 'TotalIncome' })}
              </span>
              <span className="text--bold">
                {currencyFormatter(totalIncome)}
              </span>
              <span className="text--light text--3">
                {formatMessage({ id: 'PerMonth' })}
              </span>
            </div>
          </Widget>
          <Widget>
            <div className="flex-column flex-align-center flex-1">
              <span className="text--light text--3">
                {formatMessage({ id: 'TotalExpense' })}
              </span>
              <span className="text--bold">
                {currencyFormatter(totalExpense)}
              </span>
              <span className="text--light text--3">
                {formatMessage({ id: 'PerMonth' })}
              </span>
            </div>
          </Widget>
        </div>

        <div className="flex-column flex-1 gap-4 mt-2">
          <button
            type="button"
            className="recurring__add-button"
            onClick={() => addModal.open()}
          >
            <div className="flex-align-center gap-2">
              <PlusSvg className="icon--color-primary" aria-hidden="true" />
              <span className="text--color-primary text--light text--3">
                {formatMessage({ id: 'AddRecurring' })}
              </span>
            </div>
          </button>

          {recurring.length === 0 ? (
            <div className="flex-column flex-1 flex-justify-center flex-align-center gap-2 mt-4 text--light">
              <span className="text--3">
                {formatMessage({ id: 'NoRecurring' })}
              </span>
            </div>
          ) : (
            <div className="flex-column gap-3">
              {recurring.map((definition) => (
                <RecurringItem
                  key={definition.id}
                  definition={definition}
                  isMenuOpen={openMenuId === definition.id}
                  onMenuToggle={setOpenMenuId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Recurring

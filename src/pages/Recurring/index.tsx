import { useState } from 'react'
import { useIntl } from 'react-intl'
import { PlusSvg } from '@/assets'
import { FormModal, Navbar } from '@/components'
import { useAppSelector, useDisclosure } from '@/hooks'
import RecurringItem from './RecurringItem'
import './index.scss'

const Recurring = () => {
  const { formatMessage } = useIntl()
  const addModal = useDisclosure()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const recurring = useAppSelector((s) => s.recurringReducer.recurring)

  return (
    <div className="recurring">
      <FormModal.FormRecurring
        isOpen={addModal.isOpen}
        onClose={addModal.close}
        onCancel={addModal.close}
      />

      <div className="flex-column flex-1 gap-4 p-4">
        <Navbar enableBackButton title="Recurring" />

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

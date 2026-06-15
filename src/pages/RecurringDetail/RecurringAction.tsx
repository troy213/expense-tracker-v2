import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { EditSvg, PlaySvg, SquareSvg, TrashSvg } from '@/assets'
import { FormModal } from '@/components'
import DeleteDataModal from '@/components/Modal/DeleteDataModal'
import { useAppDispatch, useDisclosure } from '@/hooks'
import { isExpired } from '@/lib/db/recurring'
import {
  deleteDBRecurring,
  editDBRecurring,
} from '@/store/recurring/recurring-thunk'
import { Recurring } from '@/types'
import { getDate } from '@/utils'

const RecurringAction = ({ data }: { data: Recurring }) => {
  const { formatMessage } = useIntl()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()

  const canToggleActive = !isExpired(data, getDate())

  const handleDelete = () => {
    dispatch(deleteDBRecurring(data.id))
    navigate('/recurring', { replace: true })
  }

  const handleToggleActive = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(
      editDBRecurring({
        definition: { ...data, is_active: !data.is_active },
        today: getDate(),
      })
    )
  }

  return (
    <div className="recurring-action">
      <FormModal.FormRecurring
        isOpen={editModal.isOpen}
        data={data}
        onClose={editModal.close}
        onCancel={editModal.close}
      />

      {deleteModal.isOpen && (
        <DeleteDataModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          title={formatMessage({ id: 'DeleteRecurring' })}
          message={formatMessage(
            { id: 'DeleteRecurringMessage' },
            { name: data.recurring_name }
          )}
          handleDelete={handleDelete}
        />
      )}

      <div className="flex gap-4">
        {canToggleActive && (
          <button
            type="button"
            className="btn btn-outline-primary flex-space-between flex-column flex-1 p-4"
            onClick={handleToggleActive}
          >
            {data.is_active ? (
              <>
                <SquareSvg
                  className="icon--md icon--color-primary"
                  aria-hidden="true"
                />
                <span className="text--3">
                  {formatMessage({ id: 'Deactivate' })}
                </span>
              </>
            ) : (
              <>
                <PlaySvg
                  className="icon--md icon--color-primary"
                  aria-hidden="true"
                />
                <span className="text--3">
                  {formatMessage({ id: 'Activate' })}
                </span>
              </>
            )}
          </button>
        )}

        <button
          type="button"
          className="btn btn-outline-primary flex-space-between flex-column flex-1 p-4"
          onClick={() => editModal.open()}
        >
          <EditSvg
            className="icon--color-primary icon--md"
            aria-hidden="true"
          />
          <span className="text--3 text--light">
            {formatMessage({ id: 'Edit' })}
          </span>
        </button>

        <button
          type="button"
          className="btn btn-outline-danger flex-space-between flex-column flex-1 p-4"
          onClick={() => deleteModal.open()}
        >
          <TrashSvg className="icon--md" aria-hidden="true" />
          <span className="text--3 text--light">
            {formatMessage({ id: 'DeleteGoal' })}
          </span>
        </button>
      </div>
    </div>
  )
}

export default RecurringAction

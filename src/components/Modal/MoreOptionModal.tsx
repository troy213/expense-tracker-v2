import { useIntl } from 'react-intl'
import { EditSvg, TrashSvg } from '@/assets'
import { combineClassName } from '@/utils'

type MoreOptionModalProps = {
  className: string
  handleEdit?: () => void
  handleDelete: () => void
}

const MoreOptionModal: React.FC<MoreOptionModalProps> = ({
  className = '',
  handleEdit = () => {},
  handleDelete,
}) => {
  const { formatMessage } = useIntl()
  const moreOptionModalClassName = combineClassName('more-option-modal', [
    className,
  ])

  return (
    <div className={moreOptionModalClassName}>
      <button
        className="btn btn-clear text--color-primary"
        type="button"
        onClick={handleEdit}
      >
        <EditSvg className="icon icon--stroke-primary" />
        <span>{formatMessage({ id: 'Edit' })}</span>
      </button>
      <button
        className="btn btn-clear text--color-danger"
        type="button"
        onClick={handleDelete}
      >
        <TrashSvg className="icon icon--stroke-danger" />
        <span>{formatMessage({ id: 'Delete' })}</span>
      </button>
    </div>
  )
}

export default MoreOptionModal

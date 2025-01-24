import { useIntl } from 'react-intl'
import Modal from '.'

type DeleteDataModalProps = {
  isOpen: boolean
  title: string
  message: string
  setIsOpen: (val: boolean) => void
  handleDelete: () => void
}

const DeleteDataModal: React.FC<DeleteDataModalProps> = ({
  isOpen,
  title,
  message,
  setIsOpen,
  handleDelete,
}) => {
  const { formatMessage } = useIntl()

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="flex-column gap-4">
        <span className="text--bold text--color-primary">{title}</span>
        <span className="text--color-primary text--3">{message}</span>
        <div className="flex-end gap-2 pt-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setIsOpen(false)}
          >
            {formatMessage({ id: 'Cancel' })}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
          >
            {formatMessage({ id: 'Delete' })}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteDataModal

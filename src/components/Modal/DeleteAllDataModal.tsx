import { useAppDispatch } from '@/hooks'
import { setStorage } from '@/utils'
import { mainAction } from '@/store/main/main-slice'
import { categoriesAction } from '@/store/categories/categories-slice'
import Modal from '.'

type DeleteAllDataModalProps = {
  isModalOpen: boolean
  handleOpenModal: (val: boolean) => void
}

const DeleteAllDataModal: React.FC<DeleteAllDataModalProps> = ({
  isModalOpen,
  handleOpenModal,
}) => {
  const dispatch = useAppDispatch()

  const handleDelete = () => {
    setStorage('data', '')
    setStorage('categories', '')
    dispatch(mainAction.resetData())
    dispatch(categoriesAction.resetState())
    handleOpenModal(false)
  }

  return (
    <Modal isOpen={isModalOpen} onClose={() => handleOpenModal(false)}>
      <div className="flex-column gap-4">
        <span className="text--bold text--color-primary">Delete Data</span>
        <span className="text--color-primary">
          Are you sure? you cannot undo this action.
        </span>
        <div className="flex-end gap-2 pt-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => handleOpenModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteAllDataModal

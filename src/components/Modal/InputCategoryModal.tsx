import { useState } from 'react'
import Modal from '.'
import Form from '../Form'

type InputCategoryModalProps = {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}

const InputCategoryModal: React.FC<InputCategoryModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [category, setCategory] = useState('')

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="input-category-modal">
        <span className="text--bold text--color-primary">
          Add Income Category
        </span>
        <Form.Input
          id="category"
          label="Category name"
          value={category}
          onChange={setCategory}
          setError={() => {}}
        />
        <div className="flex-column gap-4 mt-4">
          <button className="btn btn-primary">Add</button>
          <button
            className="btn btn-outline-primary"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default InputCategoryModal

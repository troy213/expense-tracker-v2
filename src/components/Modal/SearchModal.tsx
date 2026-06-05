import { useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { REGEX } from '@/constants'
import Modal from '.'
import Form from '../Form'

type SearchModalProps = {
  isOpen: boolean
  onClose: () => void
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const { formatMessage } = useIntl()
  const navigate = useNavigate()

  const handleSubmit = ({ search }: { search: string }) => {
    navigate(`/report-detail?search=${search}`)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Form
        className="flex-column gap-4"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      >
        <span className="text--bold text--color-primary">
          {formatMessage({ id: 'Search' })}
        </span>
        <Form.Input
          valueKey="search"
          placeholder="Search"
          label={formatMessage({ id: 'TransactionName' })}
          pattern={REGEX.COMMON_TEXT.PATTERN}
          errorMessage={REGEX.COMMON_TEXT.ERROR_MESSAGE}
          required
        />

        <Form.Submit
          className="mt-4 p-4"
          label={formatMessage({ id: 'Search' })}
        />
        <Form.Cancel />
      </Form>
    </Modal>
  )
}

export default SearchModal

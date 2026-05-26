import { useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { REGEX } from '@/constants'
import Modal from '.'
import Form from '../Form'

type SearchModalProps = {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}

const SearchModal = ({ isOpen, setIsOpen }: SearchModalProps) => {
  const { formatMessage } = useIntl()
  const navigate = useNavigate()

  const handleSubmit = ({ search }: { search: string }) => {
    navigate(`/report-detail?search=${search}`)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
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

        <Form.Submit className="mt-4" label={formatMessage({ id: 'Search' })} />
        <Form.Cancel />
      </Form>
    </Modal>
  )
}

export default SearchModal

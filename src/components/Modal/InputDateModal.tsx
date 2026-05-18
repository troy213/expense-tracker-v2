import React from 'react'
import { useIntl } from 'react-intl'
import Modal from '.'
import Form from '../Form'

type InputDateModalProps = {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  SetCustomDate: (from: Date, to: Date) => void
}

const InputDateModal: React.FC<InputDateModalProps> = ({
  isOpen,
  setIsOpen,
  SetCustomDate,
}) => {
  const { formatMessage } = useIntl()

  const handleSubmit = ({ from, to }: { from: string; to: string }) => {
    SetCustomDate(new Date(from + 'T00:00:00'), new Date(to + 'T23:59:00'))
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Form onSubmit={handleSubmit} onCancel={handleCancel}>
        <span className="text--bold text--color-primary">
          {formatMessage({ id: 'Filter' })}
        </span>

        <Form.Input
          type="date"
          valueKey="from"
          label={formatMessage({ id: 'From' })}
          required
        />
        <Form.Input
          type="date"
          valueKey="to"
          label={formatMessage({ id: 'To' })}
          required
        />

        <Form.Submit className="mt-4" label={formatMessage({ id: 'Filter' })} />
        <Form.Cancel />
      </Form>
    </Modal>
  )
}

export default InputDateModal

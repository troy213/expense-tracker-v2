import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import Modal from '.'
import Form from '../Form'

type InputDateModalProps = {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  SetCustomDate: (from: Date, to: Date) => void
}

type DateForm = {
  from: string
  to: string
}

type ErrorState = Record<keyof DateForm, string>

const dataInitialValue = {
  from: '',
  to: '',
}
const errorInitialValue = {
  from: '',
  to: '',
}

const InputDateModal: React.FC<InputDateModalProps> = ({
  isOpen,
  setIsOpen,
  SetCustomDate,
}) => {
  const [data, setData] = useState<DateForm>(dataInitialValue)
  const [error, setError] = useState<ErrorState>(errorInitialValue)
  const { formatMessage } = useIntl()

  const handleChange = <K extends keyof DateForm>(
    key: K,
    value: DateForm[K]
  ) => {
    setData((prevState) => ({
      ...prevState,
      [key]: value,
    }))
    handleError(key, '')
  }

  const handleError = <K extends keyof ErrorState>(
    key: K,
    value: ErrorState[K]
  ) => {
    setError((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let formIsValid = true

    // check any empty data
    Object.entries(data).forEach(([key, value]) => {
      if (value === '') {
        setError((prevState) => ({
          ...prevState,
          [key]: formatMessage({ id: 'FormEmptyError' }),
        }))
        formIsValid = false
      }
    })

    if (formIsValid) {
      SetCustomDate(
        new Date(data.from + 'T00:00:00'),
        new Date(data.to + 'T23:59:00')
      )
      setIsOpen(false)
    }
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault()
    setData(dataInitialValue)
    setError(errorInitialValue)
    setIsOpen(false)
  }

  useEffect(() => {
    setData(dataInitialValue)
    setError(errorInitialValue)
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <form className="input-category-modal" onSubmit={handleSubmit}>
        <span className="text--bold text--color-primary">
          {formatMessage({ id: 'Filter' })}
        </span>
        <Form.Input
          type="date"
          label={formatMessage({ id: 'From' })}
          value={data.from}
          onChange={(val) => handleChange('from', val)}
          errorMessage={error.from}
          setError={(val) => handleError('from', val)}
        />
        <Form.Input
          type="date"
          label={formatMessage({ id: 'To' })}
          value={data.to}
          onChange={(val) => handleChange('to', val)}
          errorMessage={error.to}
          setError={(val) => handleError('to', val)}
        />
        <div className="flex-column gap-4 mt-4">
          <button type="submit" className="btn btn-primary">
            {formatMessage({ id: 'Filter' })}
          </button>
          <button className="btn btn-outline-primary" onClick={handleCancel}>
            {formatMessage({ id: 'Cancel' })}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default InputDateModal

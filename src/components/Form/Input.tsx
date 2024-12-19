import { useState, useEffect } from 'react'
import { combineClassName, currencyFormatter } from '@/utils'

type InputProps = {
  type: 'text' | 'currency'
  value: string | number
  onChange: (value: string) => void
  id?: string
  className?: string
  inputClassName?: string
  label?: string
  labelClassName?: string
  placeholder?: string
  pattern?: RegExp
  errorMessage?: string
  patternErrorMessage?: string
  setError: (val: string) => void
}

const Input: React.FC<InputProps> = (props) => {
  const {
    type = 'text',
    label = '',
    placeholder = '',
    pattern = null,
    errorMessage = '',
    patternErrorMessage = '',
    id: inputId = '',
    value = '',
    setError = () => {},
    onChange = (val) => {
      console.warn('Input onChange is not defined.', `value: ${val}`)
    },
  } = props

  const [internalError, setInternalError] = useState('')

  const containerClassName = combineClassName('form-input__input-container', [
    props.className ?? '',
  ])
  const labelClassName = combineClassName(
    'text--light text--color-primary text--3',
    [props.labelClassName ?? '']
  )
  const inputClassName = combineClassName('form-input__input', [
    {
      condition: props.inputClassName !== '',
      className: props.inputClassName ?? '',
    },
    {
      condition: internalError !== '',
      className: 'form-input__input--error',
    },
    {
      condition: value !== '',
      className: 'form-input__input--has-value',
    },
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    if (type === 'currency') {
      newValue = newValue.replace(/[^\d]/g, '')
    }

    onChange(newValue)
  }

  useEffect(() => {
    const newError =
      pattern && value && !new RegExp(pattern).test(String(value))
        ? patternErrorMessage
        : errorMessage || ''

    if (newError !== internalError) {
      setInternalError(newError)
      setError(newError)
    }
  }, [
    value,
    pattern,
    errorMessage,
    patternErrorMessage,
    setError,
    internalError,
  ])

  return (
    <div className={containerClassName}>
      {label && (
        <label className={labelClassName} htmlFor={inputId}>
          {label}
        </label>
      )}
      <div>
        <input
          type="text"
          value={type === 'currency' ? currencyFormatter(value) : String(value)}
          onChange={handleChange}
          placeholder={placeholder}
          className={inputClassName}
          id={inputId}
          autoComplete="off"
        />
      </div>
      {internalError && (
        <span className="text--3 text--color-danger">{internalError}</span>
      )}
    </div>
  )
}

export default Input

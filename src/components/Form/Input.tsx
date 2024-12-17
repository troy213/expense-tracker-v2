import { useState, useEffect } from 'react'
import { combineClassName } from '@/utils'

type InputProps = {
  value: string
  id: string
  setError: (value: string) => void
  onChange: (value: string) => void
  className?: string
  inputClassName?: string
  label?: string
  labelClassName?: string
  placeholder?: string
  pattern?: RegExp
  errorMessage?: string
  patternErrorMessage?: string
}

const Input: React.FC<InputProps> = (props) => {
  const {
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
    const newValue = e.target.value
    onChange(newValue)
  }

  useEffect(() => {
    if (pattern && value && !new RegExp(pattern).test(value)) {
      setInternalError(patternErrorMessage)
      setError(patternErrorMessage)
    } else if (errorMessage) {
      setInternalError(errorMessage)
      setError(errorMessage)
    } else {
      setInternalError('')
      setError('')
    }
  }, [value, pattern, errorMessage, patternErrorMessage, setError])

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
          value={value}
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

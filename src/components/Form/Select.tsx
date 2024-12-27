import React, { useState, useRef } from 'react'
import { combineClassName } from '@/utils'
import { ChevronDownSvg } from '@/assets'

type SelectProps = {
  value: string | null
  options: string[]
  onChange: (value: string) => void
  id?: string
  className?: string
  inputClassName?: string
  optionContainerClassName?: string
  optionClassName?: string
  label?: string
  labelClassName?: string
  placeholder?: string
  placeholderClassName?: string
  errorMessage?: string
  setError?: (val: string) => void
}

const Select: React.FC<SelectProps> = (props) => {
  const {
    value = null,
    options = [],
    label = '',
    placeholder = '',
    errorMessage = '',
    id: inputId = '',
    onChange = (val) => {
      console.warn('Input onChange is not defined.', `value: ${val}`)
    },
    setError = () => {},
  } = props
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)

  const containerClassName = combineClassName('form-input__select-container', [
    props.className ?? '',
  ])
  const labelClassName = combineClassName(
    'text--light text--color-primary text--3',
    [props.labelClassName ?? '']
  )
  const inputClassName = combineClassName('form-input__select', [
    props.inputClassName ?? '',
    {
      condition: errorMessage !== '',
      className: 'form-input__select--error',
    },
  ])
  const placeholderClassName = combineClassName('', [
    props.placeholderClassName ?? '',
    {
      condition: !value,
      className: 'form-input__select-placeholder',
    },
  ])
  const optionContainerClassName = combineClassName(
    'form-input__select-option-container',
    [props.optionContainerClassName ?? '']
  )
  const optionClassName = combineClassName('form-input__select-option', [
    props.optionClassName ?? '',
  ])

  const handleOptionClick = (item: string) => {
    onChange(item)
    setError('')
    setIsOpen(false)
  }

  return (
    <div className={containerClassName}>
      {label && (
        <label className={labelClassName} htmlFor={inputId}>
          {label}
        </label>
      )}
      <div
        ref={inputRef}
        className={inputClassName}
        onClick={() => setIsOpen((val) => !val)}
        onBlur={() => setIsOpen(false)}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={placeholderClassName}>
          {value ? value : placeholder}
        </span>
        <ChevronDownSvg className="icon--sm icon--stroke-primary" />

        {isOpen && (
          <ul className={optionContainerClassName} role="listbox">
            {options.map((item, index) => (
              <li
                key={index}
                className={`${optionClassName} ${
                  value === item ? 'form-input__select-option--selected' : ''
                }`}
                role="option"
                aria-selected={value === item}
                onMouseDown={() => handleOptionClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      {errorMessage && (
        <span className="text--3 text--color-danger">{errorMessage}</span>
      )}
    </div>
  )
}

export default Select

import { useState } from 'react'
import { combineClassName } from '@/utils'

type RadioProps<T> = {
  groupId: string
  options: T[]
  onChange: (value: T) => void
  defaultValue?: string
  className?: string
  radioOptionsContainerClassName?: string
  radioClassName?: string
  label?: string
  labelClassName?: string
  errorMessage?: string
  setError?: (val: string) => void
}

const Radio = <T,>(props: RadioProps<T>) => {
  const {
    groupId = '',
    defaultValue = '',
    options = [],
    label = '',
    errorMessage = '',
    onChange = (val) => {
      console.warn('Input onChange is not defined.', `value: ${val}`)
    },
    setError = () => {},
  } = props
  const [selectedValue, setSelectedValue] = useState(defaultValue.toLowerCase())

  const containerClassName = combineClassName('flex-column gap-2', [
    props.className ?? '',
  ])
  const labelClassName = combineClassName(
    'text--light text--color-primary text--3',
    [props.labelClassName ?? '']
  )
  const radioOptionsContainerClassName =
    props.radioOptionsContainerClassName ?? 'flex-column gap-2'
  const radioClassName = combineClassName('form-input__radio', [
    props.radioClassName ?? '',
    {
      condition: errorMessage !== '',
      className: 'form-input__radio--error',
    },
  ])

  const handleOptionClick = (item: T) => {
    setSelectedValue(item as string)
    onChange(item)
    setError('')
  }

  return (
    <div className={containerClassName}>
      {label && <span className={labelClassName}>{label}</span>}
      <div className={radioOptionsContainerClassName}>
        {options.map((option, index) => {
          const optionValue = typeof option === 'string' ? option : ''

          return (
            <label className={radioClassName} key={index}>
              <input
                type="radio"
                name={groupId}
                value={option as string}
                onChange={() => handleOptionClick(option)}
                checked={selectedValue === option}
              />
              <span>{optionValue}</span>
            </label>
          )
        })}
      </div>
      {errorMessage && (
        <span className="text--3 text--color-danger">{errorMessage}</span>
      )}
    </div>
  )
}

export default Radio

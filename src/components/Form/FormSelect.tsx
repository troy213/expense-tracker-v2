import { useState, useRef } from 'react'
import { useFormContext, Controller, FieldValues } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { combineClassName } from '@/utils'
import { ChevronDownSvg } from '@/assets'
import './FormSelect.scss'

type OptionObject = { label: string; value: string }
type IdNameObject = { id: string; name: string }
type SelectOption = string | OptionObject | IdNameObject

type FormSelectProps = {
  valueKey: string
  options: readonly SelectOption[]
  label?: string
  selectedValue?: string
  placeholder?: string
  required?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
  optionContainerClassName?: string
  optionClassName?: string
}

const getOptionValue = (option: SelectOption): string => {
  if (typeof option === 'string') return option
  if ('value' in option) return option.value
  return option.id
}

const getOptionLabel = (option: SelectOption): string => {
  if (typeof option === 'string') return option
  if ('label' in option) return option.label
  return option.name
}

const FormSelect = ({
  valueKey,
  options,
  label,
  selectedValue,
  placeholder,
  required,
  className,
  labelClassName,
  inputClassName,
  optionContainerClassName,
  optionClassName,
}: FormSelectProps) => {
  const methods = useFormContext<FieldValues>()
  const { formatMessage } = useIntl()
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)

  return (
    <Controller
      name={valueKey}
      control={methods.control}
      rules={{
        validate: (value) => {
          if (
            required &&
            (value === undefined || value === null || value === '')
          ) {
            return formatMessage({ id: 'FormEmptyError' })
          }
          return true
        },
      }}
      render={({ field, fieldState }) => {
        const optionLabel = field.value
          ? getOptionLabel(
              options.find(
                (option) => getOptionValue(option) === field.value
              ) || ''
            )
          : ''

        const containerClassName = combineClassName(
          'form-input__select-container',
          [className ?? '']
        )
        const finalLabelClassName = combineClassName(
          'text--light text--color-primary text--3',
          [labelClassName ?? '']
        )
        const finalInputClassName = combineClassName('form-input__select', [
          inputClassName ?? '',
          {
            condition: fieldState.error !== undefined,
            className: 'form-input__select--error',
          },
        ])
        const placeholderClassName = combineClassName('', [
          {
            condition: !field.value,
            className: 'form-input__select-placeholder',
          },
          {
            condition: field.value !== '' && field.value !== undefined,
            className: 'form-input__select-placeholder--has-value',
          },
        ])
        const finalOptionContainerClassName = combineClassName(
          'form-input__select-option-container',
          [optionContainerClassName ?? '']
        )
        const finalOptionClassName = combineClassName(
          'form-input__select-option',
          [optionClassName ?? '']
        )

        const handleOptionClick = (value: string) => {
          field.onChange(value)
          setIsOpen(false)
        }

        return (
          <div className={containerClassName}>
            {label && <span className={finalLabelClassName}>{label}</span>}
            <div
              ref={inputRef}
              className={finalInputClassName}
              onClick={() => setIsOpen((val) => !val)}
              onBlur={() => setIsOpen(false)}
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <span className={placeholderClassName}>
                {optionLabel || selectedValue || field.value || placeholder}
              </span>
              <ChevronDownSvg className="icon--sm icon--stroke-primary" />

              {isOpen && (
                <ul className={finalOptionContainerClassName} role="listbox">
                  {options.map((option) => {
                    const optionValue = getOptionValue(option)
                    const optionLabel = getOptionLabel(option)
                    return (
                      <li
                        key={optionValue}
                        className={`${finalOptionClassName} ${
                          field.value === optionValue ? 'selected' : ''
                        }`}
                        role="option"
                        aria-selected={field.value === optionValue}
                        onMouseDown={() => handleOptionClick(optionValue)}
                      >
                        {optionLabel}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
            {fieldState.error && (
              <span className="text--3 text--color-danger">
                {fieldState.error.message}
              </span>
            )}
          </div>
        )
      }}
    />
  )
}

export default FormSelect

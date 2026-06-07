import { useId } from 'react'
import { useFormContext, Controller, FieldValues } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { ChevronDownSvg } from '@/assets'
import { combineClassName, currencyFormatter } from '@/utils'
import './FormInput.scss'

type BaseProps = {
  type?: 'text' | 'currency' | 'date'
  label?: string
  placeholder?: string
  pattern?: RegExp
  errorMessage?: string
  enableDateNavigation?: boolean
  required?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
}

type RegisteredProps = BaseProps & {
  valueKey: string
  value?: never
  onChange?: never
}

type ControlledProps = BaseProps & {
  valueKey?: never
  value: string | number
  onChange: (value: string | number) => void
}

type FormInputProps = RegisteredProps | ControlledProps

const parseCurrencyInput = (raw: string): number => {
  const digits = raw.replace(/[^\d-]/g, '')
  if (digits === '' || digits === '-') return 0
  const num = Number(digits)
  return isNaN(num) ? 0 : num
}

const validateValue = (
  value: unknown,
  required: boolean | undefined,
  pattern: RegExp | undefined,
  errorMessage: string | undefined,
  formatMessage: (msg: { id: string }) => string
): string | true => {
  const isEmpty =
    value === undefined ||
    value === null ||
    value === '' ||
    (typeof value === 'number' && isNaN(value))

  if (required && isEmpty) return formatMessage({ id: 'FormEmptyError' })
  if (pattern && !isEmpty && !pattern.test(String(value))) {
    return (
      formatMessage({ id: errorMessage ?? '' }) ??
      formatMessage({ id: 'InvalidFormatError' })
    )
  }
  return true
}

const renderField = (
  rawValue: string | number | undefined,
  setValue: (value: string | number) => void,
  props: BaseProps,
  formatMessage: (msg: { id: string }) => string,
  inputId: string,
  error?: string,
  fieldRef?: React.Ref<HTMLInputElement>,
  fieldName?: string
) => {
  const {
    type = 'text',
    label,
    placeholder,
    enableDateNavigation = false,
  } = props

  const displayValue =
    type === 'currency'
      ? rawValue === undefined || rawValue === ''
        ? ''
        : currencyFormatter(rawValue)
      : (rawValue ?? '')

  const inputType = type === 'date' ? 'date' : 'text'

  const containerClassName = combineClassName('form-input__input-container', [
    props.className ?? '',
  ])
  const labelClassName = combineClassName(
    'text--light text--color-primary text--3',
    [props.labelClassName ?? '']
  )
  const inputClassName = combineClassName('form-input__input', [
    props.inputClassName ?? '',
    {
      condition: !!error,
      className: 'form-input__input--error',
    },
  ])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'currency') {
      setValue(parseCurrencyInput(event.target.value))
    } else {
      setValue(event.target.value)
    }
  }

  const shiftDate = (days: number) => {
    const current = String(rawValue)
    if (!current) return
    const date = new Date(current)
    date.setUTCDate(date.getUTCDate() + days)
    setValue(date.toISOString().split('T')[0])
  }

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className={labelClassName}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={fieldRef}
        name={fieldName}
        className={inputClassName}
        type={inputType}
        inputMode={type === 'currency' ? 'numeric' : undefined}
        value={String(displayValue)}
        placeholder={placeholder}
        onChange={handleChange}
      />
      {type === 'date' && enableDateNavigation && (
        <div className="form-input__input-nav">
          <button
            type="button"
            className="form-input__input-nav-btn"
            onClick={() => shiftDate(-1)}
          >
            <ChevronDownSvg className="form-input__input-nav-btn--prev icon--sm icon--color-primary" />
            <span className="text--color-primary text--light text--3">
              {formatMessage({ id: 'PreviousDay' })}
            </span>
          </button>
          <button
            type="button"
            className="form-input__input-nav-btn"
            onClick={() => shiftDate(1)}
          >
            <span className="text--color-primary text--light text--3">
              {formatMessage({ id: 'NextDay' })}
            </span>
            <ChevronDownSvg className="form-input__input-nav-btn--next icon--sm icon--color-primary" />
          </button>
        </div>
      )}
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}

const FormInput = (props: FormInputProps) => {
  const { valueKey, value, onChange, pattern, errorMessage, required } = props
  const methods = useFormContext<FieldValues>()
  const { formatMessage } = useIntl()
  const inputId = useId()

  if (valueKey === undefined) {
    const error = validateValue(
      value,
      required,
      pattern,
      errorMessage,
      formatMessage
    )
    return renderField(
      value,
      (next) => onChange?.(next),
      props,
      formatMessage,
      inputId,
      error === true ? undefined : error
    )
  }

  return (
    <Controller
      name={valueKey}
      control={methods.control}
      rules={{
        validate: (fieldValue) =>
          validateValue(
            fieldValue,
            required,
            pattern,
            errorMessage,
            formatMessage
          ),
      }}
      render={({ field, fieldState }) =>
        renderField(
          field.value,
          (next) => field.onChange(next),
          props,
          formatMessage,
          inputId,
          fieldState.error?.message,
          field.ref,
          field.name
        )
      }
    />
  )
}

export default FormInput

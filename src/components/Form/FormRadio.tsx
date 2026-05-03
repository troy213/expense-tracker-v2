import { useFormContext, Controller, FieldValues } from 'react-hook-form'
import { useIntl } from 'react-intl'

type RadioOption = string | { label: string; value: string }

type FormRadioProps = {
  valueKey: string
  options: readonly RadioOption[]
  label?: string
  required?: boolean
  className?: string
}

const getValue = (option: RadioOption) =>
  typeof option === 'string' ? option : option.value

const getLabel = (option: RadioOption) =>
  typeof option === 'string' ? option : option.label

const FormRadio = ({
  valueKey,
  options,
  label,
  required,
  className,
}: FormRadioProps) => {
  const methods = useFormContext<FieldValues>()
  const { formatMessage } = useIntl()

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
      render={({ field, fieldState }) => (
        <div
          className={`form-field form-radio-group ${className ?? ''}`.trim()}
        >
          {label && (
            <label className="form-label">
              {label}
              {required && <span className="form-required">*</span>}
            </label>
          )}
          <div className="form-radio-options">
            {options.map((option) => {
              const optionValue = getValue(option)
              return (
                <label key={optionValue} className="form-radio-option">
                  <input
                    type="radio"
                    name={valueKey}
                    value={optionValue}
                    checked={field.value === optionValue}
                    onChange={() => field.onChange(optionValue)}
                  />
                  {getLabel(option)}
                </label>
              )
            })}
          </div>
          {fieldState.error && (
            <span className="form-error">{fieldState.error.message}</span>
          )}
        </div>
      )}
    />
  )
}

export default FormRadio

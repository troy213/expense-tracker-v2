import { useFormContext, Controller, FieldValues } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { combineClassName } from '@/utils'

type FormFileProps = {
  valueKey: string
  label?: string
  placeholder?: string
  accept?: '.xlsx'
  required?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
  placeholderClassName?: string
}

const FormFile = ({
  valueKey,
  label,
  placeholder = 'Select a file',
  accept = '.xlsx',
  required,
  className,
  labelClassName,
  inputClassName,
  placeholderClassName,
}: FormFileProps) => {
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
            (!value || (value instanceof File && value.size === 0))
          ) {
            return formatMessage({ id: 'FormEmptyError' })
          }
          return true
        },
      }}
      render={({ field, fieldState }) => {
        const containerClassName = combineClassName(
          'form-input__file-container',
          [className ?? '']
        )
        const finalLabelClassName = combineClassName(
          'text--light text--color-primary text--3',
          [labelClassName ?? '']
        )
        const finalInputClassName = combineClassName('form-input__file', [
          inputClassName ?? '',
        ])
        const finalPlaceholderClassName = combineClassName(
          'form-input__file-placeholder',
          [
            placeholderClassName ?? '',
            {
              condition: !field.value,
              className: 'text--light',
            },
            {
              condition: fieldState.error !== undefined,
              className: 'form-input__file-placeholder--error',
            },
          ]
        )

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files) {
            field.onChange(e.target.files[0])
          }
        }

        const fileName =
          field.value instanceof File ? field.value.name : placeholder

        return (
          <div className={containerClassName}>
            <label htmlFor={valueKey} className="flex-column gap-2">
              <span className={finalLabelClassName}>{label}</span>
              <div className={finalPlaceholderClassName}>
                <span>{fileName}</span>
              </div>
            </label>
            <input
              id={valueKey}
              type="file"
              accept={accept}
              className={finalInputClassName}
              onChange={handleFileChange}
              onClick={(e) => {
                const eventTarget = e.target as HTMLInputElement
                eventTarget.value = ''
              }}
            />
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

export default FormFile

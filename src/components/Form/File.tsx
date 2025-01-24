import { combineClassName } from '@/utils'

type InputProps = {
  value: File | null
  onChange: (value: File) => void
  id?: string
  className?: string
  inputClassName?: string
  label?: string
  labelClassName?: string
  placeholder?: string
  accept?: string
  errorMessage?: string
  setError?: (value: string) => void
}

const File: React.FC<InputProps> = (props) => {
  const {
    label = '',
    placeholder = '',
    errorMessage = '',
    id: inputId = '',
    value = '',
    accept = '.xlsx',
    onChange = (val) => {
      console.warn('Input onChange is not defined.', `value: ${val}`)
    },
    setError = () => {},
  } = props

  const containerClassName = combineClassName('form-input__file-container', [
    props.className ?? '',
  ])
  const labelClassName = combineClassName(
    'text--light text--color-primary text--3',
    [props.labelClassName ?? '']
  )
  const inputClassName = combineClassName('form-input__file', [
    props.inputClassName ?? '',
  ])
  const placeholderClassName = combineClassName(
    'form-input__file-placeholder',
    [
      {
        condition: !value,
        className: 'text--light',
      },
      {
        condition: errorMessage !== '',
        className: 'form-input__file-placeholder--error',
      },
    ]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onChange(e.target.files[0])
    setError('')
  }

  return (
    <div className={containerClassName}>
      <label htmlFor={inputId} className="flex-column gap-2">
        <span className={labelClassName}>{label}</span>
        <div className={placeholderClassName}>
          <span>{value ? value.name : placeholder}</span>
        </div>
      </label>
      <input
        id={inputId}
        type="file"
        accept={accept}
        className={inputClassName}
        onChange={handleFileChange}
        onClick={(e) => {
          const eventTarget = e.target as HTMLInputElement
          eventTarget.value = ''
        }}
      />
      {errorMessage && (
        <span className="text--3 text--color-danger">{errorMessage}</span>
      )}
    </div>
  )
}

export default File

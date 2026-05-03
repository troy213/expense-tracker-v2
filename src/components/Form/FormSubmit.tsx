import { combineClassName } from '@/utils'

type FormSubmitProps = {
  label?: string
  className?: string
  disabled?: boolean
}

const FormSubmit = ({
  label = 'Submit',
  className,
  disabled,
}: FormSubmitProps) => {
  return (
    <button
      type="submit"
      className={combineClassName('btn btn-primary', [className ?? ''])}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default FormSubmit

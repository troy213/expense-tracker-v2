import { combineClassName } from '@/utils'
import { useFormActions } from './FormContext'

type FormCancelProps = {
  label?: string
  className?: string
}

const FormCancel = ({ label = 'Cancel', className }: FormCancelProps) => {
  const { onCancel } = useFormActions()

  return (
    <button
      type="button"
      className={combineClassName('btn btn-outline-primary', [className ?? ''])}
      onClick={onCancel}
    >
      {label}
    </button>
  )
}

export default FormCancel

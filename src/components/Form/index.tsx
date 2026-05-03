import {
  useForm,
  FormProvider,
  FieldValues,
  DefaultValues,
  UseFormProps,
} from 'react-hook-form'
import { FormActionsContext } from './FormContext'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import FormRadio from './FormRadio'
import FormFile from './FormFile'
import FormSubmit from './FormSubmit'
import FormCancel from './FormCancel'
import './index.scss'

type FormProps<T extends FieldValues> = {
  defaultValues?: DefaultValues<T>
  onSubmit: (data: T) => void
  onCancel?: () => void
  children: React.ReactNode
  className?: string
  mode?: UseFormProps<T>['mode']
}

const Form = <T extends FieldValues>({
  defaultValues,
  onSubmit,
  onCancel,
  children,
  className,
  mode = 'onChange',
}: FormProps<T>) => {
  const methods = useForm<T>({ defaultValues, mode })

  return (
    <FormProvider {...methods}>
      <FormActionsContext.Provider value={{ onCancel }}>
        <form
          className={`form ${className ?? ''}`.trim()}
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
        >
          {children}
        </form>
      </FormActionsContext.Provider>
    </FormProvider>
  )
}

Form.Input = FormInput
Form.Select = FormSelect
Form.Radio = FormRadio
Form.File = FormFile
Form.Submit = FormSubmit
Form.Cancel = FormCancel

export default Form

import { createContext, useContext } from 'react'

type FormActions = {
  onCancel?: () => void
}

export const FormActionsContext = createContext<FormActions>({})

export const useFormActions = () => useContext(FormActionsContext)

export type RecurringFormValues = {
  id: string
  recurring_name: string
  transaction_name: string
  category_id: string
  amount: number
  due_day: string
  start_period: string
  active_until: string
  is_active: boolean
}

export const DUE_DAY_PATTERN = /^([1-9]|[12]\d|3[01])$/
export const PERIOD_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/

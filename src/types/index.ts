export type CategoryIconId =
  | 'credit-card'
  | 'donations'
  | 'educations'
  | 'entertainment'
  | 'expense'
  | 'food'
  | 'gift'
  | 'gym'
  | 'health'
  | 'housing'
  | 'income'
  | 'insurance'
  | 'investment'
  | 'personal-care'
  | 'pets'
  | 'phone'
  | 'price-tag'
  | 'salary'
  | 'scissor'
  | 'shopping'
  | 'subscription'
  | 'suitcase'
  | 'tax'
  | 'travel'

export type SetStatePayload<T> = {
  [K in keyof T]: {
    state: K
    value: T[K]
  }
}[keyof T]

export type CategoryType = 'income' | 'expense'

export type Category = {
  id: string
  type: CategoryType
  name: string
  icon_id: CategoryIconId
  color: string
  index: number
  is_active: boolean
  budget?: number
}

export type Transaction = {
  id: string // uuid
  date: string
  category_id: string // uuid (foreign key to categories)
  description: string
  amount: number
}

export type Data = {
  date: string
  subdata: {
    category_id: string
    item: {
      id: string
      description: string
      amount: number
    }[]
  }[]
}

export type ReportCategory = Category & {
  total: number
}

export type DashboardInfo = {
  totalIncome: number
  totalExpenses: number
  totalBudget: number
  remainingBudget: number
}

export type ConditionArray =
  | {
      condition: boolean
      className: string
    }
  | string

export type Theme = 'light' | 'dark'

export type Locales = 'en-US' | 'id-ID'

export type TxFormItem = {
  id: string
  description: string
  amount: number
}

export type TxFormData = {
  date: string
  category_id: string
  item: TxFormItem[]
}

export type TransactionFilters = {
  type?: 'income' | 'expense'
  category_id?: string
  search?: string
  date_from?: string
  date_to?: string
}

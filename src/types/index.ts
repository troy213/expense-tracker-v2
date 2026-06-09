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

export type GoalStatus = 'in_progress' | 'completed' | 'spent' | 'cancelled'

export type Goal = {
  id: string
  name: string
  target_amount: number
  deadline: string | null
  category_id: string // FK → categories (expense); drives icon, color, spend category
  status: GoalStatus
  linked_transaction_id?: string // set only when status='spent'
  created_at: string
}

export type GoalHistoryEntry = {
  id: string
  goal_id: string // FK → goals.id
  type: 'contribution' | 'withdrawal'
  amount: number // always > 0
  date: string
}

export type ReportCategory = Category & {
  total: number
}

export type DashboardInfo = {
  totalIncome: number
  totalExpense: number
  totalBudget: number
  remainingBudget: number
}

export type ConditionArray =
  | {
      condition: boolean
      className: string
    }
  | string

// User-facing preference. 'system' follows the OS; it resolves to 'light' or
// 'dark' at runtime (see App.tsx) and is never written to `data-theme`.
export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

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

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

export type Recurring = {
  id: string // uuid
  recurring_name: string // display name of the rule, e.g. "BCA Credit Card"
  transaction_name: string // generated transaction's description
  category_id: string // FK → categories; the category's type encodes income vs expense
  amount: number // default/expected amount (editable at Add time)
  due_day: number // 1–31; clamped to the month's last day for short months
  start_period: string // "YYYY-MM"; first period eligible for generation
  active_until: string | null // "YYYY-MM"; null = runs indefinitely
  is_active: boolean // auto-set false by the generator once active_until is exceeded
}

export type RecurringStatus = 'pending' | 'added' | 'skipped'

export type RecurringHistoryEntry = {
  id: string // `${recurring_id}:${period}` — the store enforces one row per (definition, month)
  recurring_id: string // FK → recurring.id
  date: string // clamped due date "YYYY-MM-DD"; becomes the transaction date
  category_id: string // snapshot from the definition (kept fresh while pending)
  transaction_name: string // snapshot from the definition (kept fresh while pending)
  amount: number // pending: definition default; added: what was actually added
  status: RecurringStatus
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

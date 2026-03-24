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

export type ConditionArray =
  | {
      condition: boolean
      className: string
    }
  | string

export type Theme = 'light' | 'dark'

export type Locales = 'en-US' | 'id-ID'

export type TransactionForm = {
  type?: CategoryType
  date: string
  category_id: string
}

export type TxDetailsForm = {
  id: string
  description: string
  amount: number
}

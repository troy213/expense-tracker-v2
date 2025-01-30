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

export type Data = {
  id: string
  date: string
  subdata: {
    id: string
    type: CategoryType
    category: string
    item: {
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
  type: CategoryType
  date: string
  category: string
}

export type TxDetailsForm = {
  description: string
  amount: number
}

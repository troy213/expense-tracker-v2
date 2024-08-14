export type SetStatePayload<T> = {
  [K in keyof T]: {
    state: K
    value: T[K]
  }
}[keyof T]

export type Category = {
  id: string
  type: 'income' | 'outcome'
  name: string
  budget?: number
}

export type Data = {
  id: string
  date: Date
  subdata: {
    type: 'income' | 'outcome'
    category: string
    description: string
    amount: number
  }
}

export type ConditionArray = {
  condition: boolean
  className: string
}

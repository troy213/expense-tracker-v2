export type SetStatePayload<T> = {
  state: keyof T
  value: T[keyof T]
}

export type Category = {
  type: 'income' | 'outcome'
  name: string
  budget?: number
}

export type Data = {
  date: Date
  subdata: {
    type: 'income' | 'outcome'
    category: string
    description: string
    amount: number
  }
}

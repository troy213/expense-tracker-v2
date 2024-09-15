import { ConditionArray } from '@/types'

export const combineClassName = (
  defaultStyle: string = '',
  conditionArray: string[] | ConditionArray[] = []
): string => {
  let result = defaultStyle

  conditionArray.forEach((item) => {
    if (typeof item === 'string' && item.trim()) result += ` ${item}`
    if (item && typeof item !== 'string' && item.condition)
      result += ` ${item.className ?? ''}`
  })

  return result.trim()
}

export const setStateReducerValue = <T, K extends keyof T>(
  state: T,
  key: K,
  value: T[K]
) => {
  state[key] = value
}

export const setStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value)
}

export const getStorage = (key: string) => {
  return localStorage.getItem(key)
}

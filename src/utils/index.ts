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

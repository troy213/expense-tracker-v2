import { Goal, GoalStatus } from '@/types'
import { combineClassName, currencyFormatter } from '@/utils'

/**
 * Message-id map for a goal's status pill. Shared by the Goals list and the
 * Goal-detail card so the label wording stays in one place.
 */
export const GOAL_STATUS_LABEL_ID: Record<GoalStatus, string> = {
  in_progress: 'GoalInProgress',
  completed: 'GoalCompleted',
  spent: 'GoalSpent',
  cancelled: 'GoalCancelled',
}

/** A goal still counts toward the locked balance while active. */
export const isActiveGoal = (status: GoalStatus): boolean =>
  status === 'in_progress' || status === 'completed'

/**
 * Progress-bar fill class for a goal: cancelled → muted, completed/spent →
 * success, otherwise the default accent fill.
 */
export const goalProgressFillClassName = (status: GoalStatus): string =>
  combineClassName('progress-bar__fill--goal', [
    {
      condition: status === 'cancelled',
      className: 'progress-bar__fill--goal-cancelled',
    },
    {
      condition: status === 'completed' || status === 'spent',
      className: 'progress-bar__fill--goal-success',
    },
  ])

/**
 * Derive the percentage saved against the target. `progressPercent` can exceed
 * 100 (used for the displayed figure); `barFill` is clamped to 100 for the bar
 * width. A non-positive target yields 0 to avoid divide-by-zero.
 */
export const goalProgress = (
  saved: number,
  target: number
): { progressPercent: number; barFill: number } => {
  const progressPercent = target > 0 ? (saved / target) * 100 : 0
  return { progressPercent, barFill: Math.min(progressPercent, 100) }
}

/**
 * Amount the user must set aside per remaining day to reach the target by the
 * deadline. Returns null when there's no deadline or nothing left to save.
 */
export const goalPerDay = (
  saved: number,
  target: number,
  deadline: string | null
): number | null => {
  const remaining = Math.max(0, target - saved)
  if (!deadline || remaining <= 0) return null

  const daysUntilDeadline = Math.max(
    1,
    Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )
  )
  return Math.ceil(remaining / daysUntilDeadline)
}

/**
 * The react-intl descriptor for a goal's delete-confirmation message: warns
 * about a saved balance unless the goal was already spent. Returned (rather
 * than formatted) so it's pure and the caller owns `formatMessage`.
 */
export const goalDeleteMessageDescriptor = (
  goal: Goal,
  saved: number
): { id: string; values: Record<string, string | number> } =>
  saved > 0 && goal.status !== 'spent'
    ? {
        id: 'GoalDeleteWithBalance',
        values: { amount: currencyFormatter(saved) },
      }
    : { id: 'DeleteDataSpecific', values: { name: goal.name } }

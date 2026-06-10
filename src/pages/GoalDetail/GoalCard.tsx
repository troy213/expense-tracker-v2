import { useIntl } from 'react-intl'
import { CategoryIcon, ProgressBar } from '@/components'
import { useAppSelector } from '@/hooks'
import { Goal } from '@/types'
import {
  combineClassName,
  currencyFormatter,
  formatTransactionDate,
} from '@/utils'
import {
  GOAL_STATUS_LABEL_ID,
  goalPerDay,
  goalProgress,
  goalProgressFillClassName,
} from '@/utils/goal'

type GoalCardProps = {
  goal: Goal
}

const GoalCard = ({ goal }: GoalCardProps) => {
  const { formatMessage } = useIntl()

  const category = useAppSelector((s) =>
    s.categoriesReducer.categories.find((c) => c.id === goal.category_id)
  )
  const { totalSaved: saved, totalTarget } = useAppSelector(
    (s) => s.goalDetailReducer
  )

  const { progressPercent, barFill } = goalProgress(saved, totalTarget)
  const progressFillClassName = goalProgressFillClassName(goal.status)
  const perDay = goalPerDay(saved, totalTarget, goal.deadline)

  const cardClassName = combineClassName('goal-detail__card', [
    {
      condition: goal.status === 'cancelled',
      className: 'goal-detail__card--cancelled',
    },
  ])

  return (
    <div className={cardClassName}>
      <div className="flex-space-between flex-align-center gap-4">
        <div className="flex-align-center gap-4">
          {category && (
            <CategoryIcon
              iconId={category.icon_id}
              color={category.color}
              isActive={goal.status !== 'cancelled'}
            />
          )}
          <div className="flex-column gap-1">
            <span className="text--bold text--color-primary">{goal.name}</span>
            {goal.deadline && (
              <span className="text-light text--color-primary text--3">
                {formatMessage(
                  { id: 'Due' },
                  { date: formatTransactionDate(goal.deadline) }
                )}
              </span>
            )}
          </div>
        </div>
        <span className={`pill pill--${goal.status}`}>
          {formatMessage({ id: GOAL_STATUS_LABEL_ID[goal.status] })}
        </span>
      </div>

      <div className="flex-column gap-2">
        <div className="flex-space-between flex-align-end">
          <div className="flex-column">
            <span className="text--bold text--8">
              {currencyFormatter(saved)}
            </span>
            <span className="text--light text--3">
              {formatMessage(
                { id: 'GoalSavedOf' },
                { amount: currencyFormatter(totalTarget) }
              )}
            </span>
          </div>
          <span className="text--light text--3">
            {progressPercent.toFixed(0)}%
          </span>
        </div>

        <ProgressBar
          amount={barFill}
          options={{
            enableStyle: false,
            progressClassName: progressFillClassName,
          }}
        />
      </div>

      {perDay && (
        <span className="text--light text--3 text--italic mt-2">
          {formatMessage(
            { id: 'GoalDailyAmount' },
            { amount: currencyFormatter(perDay) }
          )}
        </span>
      )}
    </div>
  )
}

export default GoalCard

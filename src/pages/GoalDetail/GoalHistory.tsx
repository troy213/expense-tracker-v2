import { useIntl } from 'react-intl'
import { ArrowDownSvg, ArrowUpSvg } from '@/assets'
import { useAppSelector } from '@/hooks'
import {
  combineClassName,
  currencyFormatter,
  formatTransactionDate,
} from '@/utils'

const GoalHistory = () => {
  const { formatMessage } = useIntl()
  const { goalHistory } = useAppSelector((s) => s.goalDetailReducer)

  return (
    <div className="flex-column flex-1 gap-4">
      <span className="text--bold text--color-primary">
        {formatMessage({ id: 'GoalHistory' })}
      </span>

      {goalHistory.length === 0 ? (
        <div className="flex-align-center flex-justify-center flex-1">
          <span className="text--light text--3">
            {formatMessage({ id: 'NoTransaction' })}
          </span>
        </div>
      ) : (
        goalHistory.map((entry) => {
          const iconClassName = combineClassName(
            'goal-detail__history-item-icon',
            [
              {
                condition: entry.type === 'contribution',
                className: 'icon--color-success',
              },
              {
                condition: entry.type === 'withdrawal',
                className: 'icon--color-danger',
              },
            ]
          )

          return (
            <div key={entry.id} className="goal-detail__history-item p-4">
              <div className="flex-space-between flex-align-center">
                <div className="flex-align-center gap-4">
                  <div className={iconClassName}>
                    {entry.type === 'contribution' ? (
                      <ArrowUpSvg aria-hidden="true" />
                    ) : (
                      <ArrowDownSvg aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-column gap-1">
                    <span
                      className={
                        entry.type === 'contribution'
                          ? 'text--color-success'
                          : 'text--color-danger'
                      }
                    >
                      {entry.type === 'contribution'
                        ? `+${currencyFormatter(entry.amount)}`
                        : `-${currencyFormatter(entry.amount)}`}
                    </span>
                    <span className="text--light text--3">
                      {formatTransactionDate(entry.date)}
                    </span>
                  </div>
                </div>
                <span className="text--light text--3 text--italic">
                  {formatMessage({
                    id:
                      entry.type === 'contribution' ? 'Contribute' : 'Withdraw',
                  })}
                </span>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default GoalHistory

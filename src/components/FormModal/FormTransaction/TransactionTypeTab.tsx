import { useIntl } from 'react-intl'
import { CategoryType } from '@/types'
import { combineClassName } from '@/utils'
import './TransactionTypeTab.scss'

const TransactionTypeTab = ({
  categoryType,
  setCategoryType,
}: {
  categoryType: CategoryType
  setCategoryType: React.Dispatch<React.SetStateAction<CategoryType>>
}) => {
  const { formatMessage } = useIntl()

  return (
    <div className="transaction-type-tabs">
      <span className="text--color-primary text--light text--3">
        {formatMessage({ id: 'Transaction' })}
      </span>
      <div
        className="transaction-type-tabs__container"
        role="tablist"
        aria-label={formatMessage({ id: 'Transaction' })}
      >
        {(['income', 'expense'] as CategoryType[]).map((value) => {
          const tabItemClassName = combineClassName(
            'transaction-type-tabs__tab',
            [
              {
                condition: categoryType === value,
                className: 'selected',
              },
            ]
          )

          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={categoryType === value}
              className={tabItemClassName}
              onClick={() => setCategoryType(value)}
            >
              {formatMessage({
                id: value === 'income' ? 'Income' : 'Expense',
              })}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TransactionTypeTab

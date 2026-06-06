import { useIntl } from 'react-intl'
import { CategoryType } from '@/types'
import { combineClassName } from '@/utils'
import { useCategoriesContext } from './CategoriesContext'
import './CategoryTabFilter.scss'

const CategoryTabFilter = () => {
  const { formatMessage } = useIntl()
  const { selectedCategory, setSelectedCategory } = useCategoriesContext()

  return (
    <div
      className="category-tab-filter"
      role="tablist"
      aria-label={formatMessage({ id: 'Transaction' })}
    >
      {(['income', 'expense'] as CategoryType[]).map((value) => {
        const tabItemClassName = combineClassName('category-tab-filter__tab', [
          {
            condition: selectedCategory === value,
            className: 'selected',
          },
        ])

        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={selectedCategory === value}
            className={tabItemClassName}
            onClick={() => setSelectedCategory(value)}
          >
            {formatMessage({
              id: value === 'income' ? 'Income' : 'Expense',
            })}
          </button>
        )
      })}
    </div>
  )
}

export default CategoryTabFilter

import { useState } from 'react'
import { PlusSvg } from '@/assets'
import InputCategoryModal from '@/components/Modal/InputCategoryModal'
import { combineClassName } from '@/utils'
import CategoryWidget from './CategoryWidget'
import { useIntl } from 'react-intl'

type SelectedCategory = 'income' | 'expense'

const CategoryTabView = () => {
  const { formatMessage } = useIntl()
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory>('income')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const contentClassName = combineClassName('category-tab-view__content', [
    {
      condition: selectedCategory === 'income',
      className: 'active--left',
    },
    {
      condition: selectedCategory === 'expense',
      className: 'active--right',
    },
  ])

  const handleSetCategory = (category: SelectedCategory) => {
    setSelectedCategory(category)
  }

  return (
    <div className="category-tab-view">
      <InputCategoryModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />

      <ul className="flex">
        <li
          className={`category-tab-view__tab${selectedCategory === 'income' ? ' selected' : ''}`}
        >
          <button
            type="button"
            className="btn btn-clear"
            onClick={() => handleSetCategory('income')}
          >
            {formatMessage({ id: 'Income' })}
          </button>
        </li>
        <li
          className={`category-tab-view__tab${selectedCategory === 'expense' ? ' selected' : ''}`}
        >
          <button
            type="button"
            className="btn btn-clear"
            onClick={() => handleSetCategory('expense')}
          >
            {formatMessage({ id: 'Expense' })}
          </button>
        </li>
      </ul>

      <div className={contentClassName}>
        {/* This widget only show when the expense tab is selected */}
        {selectedCategory === 'expense' && (
          <div className="category-tab-view__budget-widget">
            <div className="flex-column flex-align-center gap-2">
              <span className="text--light text--3">
                {formatMessage({ id: 'TotalMaxBudget' })}
              </span>
              <span>Rp1.234.567</span>
            </div>
          </div>
        )}

        <button
          type="button"
          className="category-tab-view__add-button"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex-align-center gap-2">
            <PlusSvg className="icon--stroke-primary" />
            <span className="text--color-primary text--light text--3">
              {formatMessage({ id: 'AddCategory' })}
            </span>
          </div>
        </button>

        {/* All categories data will be looped here */}

        {/* Expense categories can have a budget  */}
        <CategoryWidget type="expense" />

        {/* Income categories don't have a budget  */}
        <CategoryWidget type="income" />
      </div>
    </div>
  )
}

export default CategoryTabView

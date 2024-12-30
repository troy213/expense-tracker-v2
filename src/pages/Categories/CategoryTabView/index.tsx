import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { PlusSvg } from '@/assets'
import InputCategoryModal from '@/components/Modal/InputCategoryModal'
import { combineClassName, currencyFormatter } from '@/utils'
import { CategoryType } from '@/types'
import { useAppSelector } from '@/hooks'
import CategoryWidget from './CategoryWidget'

const CategoryTabView = () => {
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const categoryParam = query.get('cat')
  const defaultSelectedCategory: CategoryType =
    categoryParam === 'expense' ? categoryParam : 'income'

  const { formatMessage } = useIntl()
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(
    defaultSelectedCategory
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const totalBudget = categories
    .filter((category) => category.type === selectedCategory)
    .reduce((acc, curr) => acc + (curr.budget ?? 0), 0)

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
  const incomeTabViewClassName = combineClassName('category-tab-view__tab', [
    { condition: selectedCategory === 'income', className: 'selected' },
  ])
  const expenseTabViewClassName = combineClassName('category-tab-view__tab', [
    { condition: selectedCategory === 'expense', className: 'selected' },
  ])

  useEffect(() => {
    const newSelectedCategory: CategoryType =
      categoryParam === 'expense' ? categoryParam : 'income'
    setSelectedCategory(newSelectedCategory)
  }, [categoryParam])

  return (
    <div className="category-tab-view">
      <InputCategoryModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        selectedCategory={selectedCategory}
      />

      <ul className="flex">
        <li className={incomeTabViewClassName}>
          <button
            type="button"
            className="btn btn-clear"
            onClick={() => setSelectedCategory('income')}
          >
            {formatMessage({ id: 'Income' })}
          </button>
        </li>
        <li className={expenseTabViewClassName}>
          <button
            type="button"
            className="btn btn-clear"
            onClick={() => setSelectedCategory('expense')}
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
              <span>{currencyFormatter(totalBudget)}</span>
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

        {categories
          .filter((category) => category.type === selectedCategory)
          .map((category) => (
            <CategoryWidget
              key={category.id}
              type={category.type}
              name={category.name}
              budget={category.budget ?? 0}
            />
          ))}
      </div>
    </div>
  )
}

export default CategoryTabView

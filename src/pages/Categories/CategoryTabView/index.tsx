import { useState } from 'react'
import { PlusSvg } from '@/assets'
import { combineClassName } from '@/utils'
import CategoryWidget from './CategoryWidget'

type SelectedCategory = 'income' | 'outcome'

const CategoryTabView = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory>('income')

  const contentClassName = combineClassName('category-tab-view__content', [
    {
      condition: selectedCategory === 'income',
      className: 'active--left',
    },
    {
      condition: selectedCategory === 'outcome',
      className: 'active--right',
    },
  ])

  const handleSetCategory = (category: SelectedCategory) => {
    setSelectedCategory(category)
  }

  return (
    <div className="category-tab-view">
      <ul className="flex">
        <li
          className={`category-tab-view__tab${selectedCategory === 'income' ? ' selected' : ''}`}
        >
          <button
            type="button"
            className="btn btn-clear"
            onClick={() => handleSetCategory('income')}
          >
            Income
          </button>
        </li>
        <li
          className={`category-tab-view__tab${selectedCategory === 'outcome' ? ' selected' : ''}`}
        >
          <button
            type="button"
            className="btn btn-clear"
            onClick={() => handleSetCategory('outcome')}
          >
            Outcome
          </button>
        </li>
      </ul>

      <div className={contentClassName}>
        {/* This widget only show when the outcome tab is selected */}
        {selectedCategory === 'outcome' && (
          <div className="category-tab-view__budget-widget">
            <div className="flex-column flex-align-center gap-2">
              <span className="text--light text--3">Total Max Budget</span>
              <span>Rp1.234.567</span>
            </div>
          </div>
        )}

        <button type="button" className="category-tab-view__add-button">
          <div className="flex-align-center gap-2">
            <PlusSvg className="icon--stroke-primary" />
            <span className="text--light text--3">Add Category</span>
          </div>
        </button>

        {/* All categories data will be looped here */}

        {/* Outcome categories can have a budget  */}
        <CategoryWidget type="outcome" />

        {/* Income categories don't have a budget  */}
        <CategoryWidget type="income" />
      </div>
    </div>
  )
}

export default CategoryTabView

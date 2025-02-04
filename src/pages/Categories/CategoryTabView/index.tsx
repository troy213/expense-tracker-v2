import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useIntl } from 'react-intl'
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PlusSvg } from '@/assets'
import InputCategoryModal from '@/components/Modal/FormCategoryModal'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { categoriesAction } from '@/store/categories/categories-slice'
import { CategoryType } from '@/types'
import { combineClassName, currencyFormatter } from '@/utils'
import CategoryWidget from './CategoryWidget'

const CategoryTabView = () => {
  const dispatch = useAppDispatch()
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
  const [filteredCategory, setFilteredCategory] = useState(
    categories.filter((category) => category.type === selectedCategory)
  )

  const totalBudget = filteredCategory.reduce(
    (acc, curr) => acc + (curr.budget ?? 0),
    0
  )

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

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  })
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  // Drag and drop event handler
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over) return
    if (active.id === over.id) return
    const activeIndex = filteredCategory.findIndex(
      (item) => item.id === active.id
    )
    const overIndex = filteredCategory.findIndex((item) => item.id === over.id)
    if (activeIndex !== -1 && overIndex !== -1) {
      const updatedCategories = [...filteredCategory]
      const [movedItem] = updatedCategories.splice(activeIndex, 1)
      updatedCategories.splice(overIndex, 0, movedItem)
      setFilteredCategory(updatedCategories)

      dispatch(
        categoriesAction.sortCategories({
          filteredCategory: updatedCategories,
          selectedCategory,
        })
      )
    }
  }

  useEffect(() => {
    const newSelectedCategory: CategoryType =
      categoryParam === 'expense' ? categoryParam : 'income'
    setSelectedCategory(newSelectedCategory)
  }, [categoryParam])

  useEffect(() => {
    setFilteredCategory(
      categories.filter((category) => category.type === selectedCategory)
    )
  }, [selectedCategory, categories])

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

        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={filteredCategory}
            strategy={verticalListSortingStrategy}
          >
            {filteredCategory.map((category) => (
              <CategoryWidget
                key={category.id}
                id={category.id}
                type={category.type}
                name={category.name}
                budget={category.budget ?? 0}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}

export default CategoryTabView

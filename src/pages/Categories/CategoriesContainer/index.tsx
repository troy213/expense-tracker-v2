import { closestCorners, DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useCategoriesContext } from '../CategoriesContext'
import CategoryItem from './CategoryItem'
import { useCategoryDnd } from './useCategoryDnd'
import './index.scss'

const CategoryContainer = () => {
  const { selectedCategory, filteredCategory } = useCategoriesContext()
  const { sensors, handleDragEnd } = useCategoryDnd(
    filteredCategory,
    selectedCategory
  )

  return (
    <div className="category-container">
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
            <CategoryItem key={category.id} data={category} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default CategoryContainer

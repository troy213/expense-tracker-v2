import {
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useAppDispatch } from '@/hooks'
import dbServices from '@/lib/db'
import { categoriesAction } from '@/store/categories/categories-slice'
import { Category, CategoryType } from '@/types'

/**
 * Drag-and-drop reordering for the category list. Reorders `filteredCategory`,
 * dispatches the new order to the store optimistically, then persists the
 * re-indexed categories to IndexedDB.
 */
export const useCategoryDnd = (
  filteredCategory: Category[],
  selectedCategory: CategoryType
) => {
  const dispatch = useAppDispatch()

  // Require a 10px drag before activating so taps still register as clicks.
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  })
  // Hold for 250ms (5px tolerance) before a touch starts a drag.
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeIndex = filteredCategory.findIndex(
      (item) => item.id === active.id
    )
    const overIndex = filteredCategory.findIndex((item) => item.id === over.id)
    if (activeIndex === -1 || overIndex === -1) return

    const reordered = [...filteredCategory]
    const [movedItem] = reordered.splice(activeIndex, 1)
    reordered.splice(overIndex, 0, movedItem)

    const reindexed = reordered.map((category, index) => ({
      ...category,
      index,
    }))

    dispatch(
      categoriesAction.sortCategories({
        filteredCategory: reindexed,
        selectedCategory,
      })
    )

    await dbServices.categories.putCategories(reindexed)
  }

  return { sensors, handleDragEnd }
}

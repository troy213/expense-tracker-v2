import { useWatch } from 'react-hook-form'
import CategoryIcon from '@/components/CategoryIcon'
import { useAppSelector } from '@/hooks'

const CategoryIconPreview = () => {
  const categories = useAppSelector(
    (state) => state.categoriesReducer.categories
  )
  const categoryId = useWatch({ name: 'category_id' })
  const category = categories.find((c) => c.id === categoryId)

  if (!category) return null

  return (
    <CategoryIcon
      iconId={category.icon_id}
      color={category.color}
      isActive={category.is_active}
      height="3.5rem"
      width="3.5rem"
    />
  )
}

export default CategoryIconPreview

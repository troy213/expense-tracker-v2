import { useFormContext } from 'react-hook-form'
import { useAppSelector } from '@/hooks'
import { TxFormData } from '@/types'
import CategoryIcon from '@/components/CategoryIcon'

const CategoryIconPreview = () => {
  const categories = useAppSelector(
    (state) => state.categoriesReducer.categories
  )
  const { watch } = useFormContext<TxFormData>()
  const categoryId = watch('category_id')

  const category = categories.find((cat) => cat.id === categoryId)

  if (!category) return null

  return (
    <CategoryIcon
      iconId={category.icon_id}
      color={category.color}
      isActive={category.is_active}
      height={'3.5rem'}
      width={'3.5rem'}
    />
  )
}

export default CategoryIconPreview

import { CATEGORY_ICONS_MAP } from '@/assets/categories-icons'
import { CategoryIconId } from '@/types'
import './index.scss'

type CategoryIconProps = {
  iconId: CategoryIconId
  color?: string
}

const CategoryIcon = ({ iconId, color }: CategoryIconProps) => {
  const IconComponent = CATEGORY_ICONS_MAP[iconId]
  return (
    <div
      className="category-icon"
      style={
        {
          backgroundColor: color ? `${color}33` : undefined,
          '--icon-color': color,
        } as React.CSSProperties
      }
    >
      {IconComponent && <IconComponent className="icon--xl" />}
    </div>
  )
}

export default CategoryIcon

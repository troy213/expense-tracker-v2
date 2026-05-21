import { CATEGORY_ICONS_MAP } from '@/assets/categories-icons'
import { CategoryIconId } from '@/types'
import './index.scss'

type CategoryIconProps = {
  iconId: CategoryIconId
  color?: string
  width?: number | string
  height?: number | string
}

const CategoryIcon = ({ iconId, color, width, height }: CategoryIconProps) => {
  const IconComponent = CATEGORY_ICONS_MAP[iconId]
  return (
    <div
      className="category-icon"
      style={
        {
          '--icon-color': color,
          backgroundColor: color ? `${color}33` : undefined,
          width: width || '',
          height: height || '',
        } as React.CSSProperties
      }
    >
      {IconComponent && <IconComponent className="icon--xl" />}
    </div>
  )
}

export default CategoryIcon

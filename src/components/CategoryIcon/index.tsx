import {
  CATEGORY_ICONS_MAP,
  DEFAULT_MUTE_COLOR,
} from '@/assets/categories-icons'
import { CategoryIconId } from '@/types'
import './index.scss'

type CategoryIconProps = {
  iconId: CategoryIconId
  color?: string
  isActive?: boolean
  width?: number | string
  height?: number | string
  iconClassName?: string
}

const CategoryIcon = ({
  iconId,
  color,
  isActive,
  width,
  height,
  iconClassName,
}: CategoryIconProps) => {
  const IconComponent = CATEGORY_ICONS_MAP[iconId]
  const iconColor = isActive ? color : DEFAULT_MUTE_COLOR

  return (
    <div
      className="category-icon"
      style={
        {
          '--icon-color': iconColor,
          backgroundColor: iconColor ? `${iconColor}33` : undefined,
          width: width || '',
          height: height || '',
        } as React.CSSProperties
      }
    >
      {IconComponent && (
        <IconComponent className={iconClassName || 'icon--xl'} />
      )}
    </div>
  )
}

export default CategoryIcon

import { useIntl } from 'react-intl'
import { CATEGORY_ICONS } from '@/assets/categories-icons'
import { CategoryIconId } from '@/types'
import './index.scss'

type IconPickerProps = {
  selectedIcon: CategoryIconId
  selectedColor: string
  onChange: (id: CategoryIconId) => void
}

const IconPicker = ({
  selectedIcon,
  selectedColor,
  onChange,
}: IconPickerProps) => {
  const { formatMessage } = useIntl()
  return (
    <div className="icon-picker">
      <span className="text--3 text--light text--color-primary">
        {formatMessage({ id: 'Icon' })}
      </span>
      <div className="icon-picker__grid">
        {CATEGORY_ICONS.map(({ id, component: IconComponent }) => {
          const isSelected = selectedIcon === id
          return (
            <button
              key={id}
              type="button"
              className={`icon-picker-item${isSelected ? ' icon-picker-item--selected' : ''}`}
              style={
                isSelected
                  ? ({
                      '--icon-color': selectedColor,
                      '--icon-bg': selectedColor
                        ? `${selectedColor}33`
                        : undefined,
                    } as React.CSSProperties)
                  : undefined
              }
              onClick={() => onChange(id)}
            >
              <IconComponent className="icon--lg" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default IconPicker

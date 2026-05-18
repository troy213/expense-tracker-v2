import { useIntl } from 'react-intl'
import { ICON_COLORS } from '@/assets/categories-icons'
import './index.scss'

type ColorPickerProps = {
  selectedColor: string | undefined
  onChange: (color: string) => void
}

const ColorPicker = ({ selectedColor, onChange }: ColorPickerProps) => {
  const { formatMessage } = useIntl()
  return (
    <div className="color-picker">
      <span className="text--3 text--light text--color-primary">
        {formatMessage({ id: 'Color' })}
      </span>
      <div className="color-picker__grid">
        {ICON_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={`color-swatch${selectedColor === color ? ' color-swatch--selected' : ''}`}
            style={
              {
                backgroundColor: color,
                '--swatch-color': color,
              } as React.CSSProperties
            }
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
  )
}

export default ColorPicker

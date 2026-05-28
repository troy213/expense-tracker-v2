import { combineClassName } from '@/utils'

type WidgetProps = {
  children: JSX.Element
  className?: string
}

const Widget: React.FC<WidgetProps> = ({ children, className = '' }) => {
  const widgetClassName = combineClassName('widget', [className])

  return <div className={widgetClassName}>{children}</div>
}

export default Widget

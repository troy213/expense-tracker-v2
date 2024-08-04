type WidgetProps = {
  children: JSX.Element
}

const Widget: React.FC<WidgetProps> = ({ children }) => {
  return <div className='widget'>{children}</div>
}

export default Widget

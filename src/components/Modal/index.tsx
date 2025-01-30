import ReactDOM from 'react-dom'
import { combineClassName } from '@/utils'

type ModalProps = {
  isOpen: boolean
  children: JSX.Element
  onClose: () => void
  className?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  children,
  className = '',
  onClose,
}) => {
  const handleClickOutside = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target instanceof HTMLElement && e.target.id === 'modal') {
      onClose()
    }
  }

  const modalClassName = combineClassName('modal', [className])

  if (!isOpen) {
    return null
  }

  const portalElement = document.getElementById('portal')
  if (!portalElement) {
    return null
  }

  return ReactDOM.createPortal(
    <div className={modalClassName} id="modal" onClick={handleClickOutside}>
      <div className="modal__container">{children}</div>
    </div>,
    portalElement
  )
}

export default Modal

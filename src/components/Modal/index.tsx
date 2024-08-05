import ReactDOM from 'react-dom'

type ModalProps = {
  open: boolean
  children: JSX.Element
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ open, children, onClose }) => {
  const handleClickOutside = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target instanceof HTMLElement && e.target.id === 'modal') {
      onClose()
    }
  }

  if (!open) {
    return null
  }

  const portalElement = document.getElementById('portal')
  if (!portalElement) {
    return null
  }

  return ReactDOM.createPortal(
    <div className='modal' id='modal' onClick={handleClickOutside}>
      <div className='modal__container'>{children}</div>
    </div>,
    portalElement
  )
}

export default Modal

import { ArrowLeftSvg } from '@/assets'
import { useNavigate } from 'react-router-dom'

type NavbarProps = {
  children: JSX.Element
  enableBackButton?: boolean
  backButtonClass?: string
}

const Navbar: React.FC<NavbarProps> = ({
  children,
  enableBackButton,
  backButtonClass,
}) => {
  const backBtnClass = backButtonClass ?? 'icon--stroke-primary'
  const navigate = useNavigate()

  const handleBack = (): void => {
    navigate(-1)
  }

  return (
    <div className='navbar flex-align-center gap-2'>
      {enableBackButton && (
        <button className='btn btn-clear' type='button' onClick={handleBack}>
          <ArrowLeftSvg className={backBtnClass} />
        </button>
      )}

      {children}
    </div>
  )
}

export default Navbar

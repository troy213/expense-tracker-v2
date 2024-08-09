import { ArrowLeftSvg } from '@/assets'
import { useNavigate } from 'react-router-dom'

type NavbarProps = {
  children?: JSX.Element
  title?: string
  titleClass?: string
  enableBackButton?: boolean
  backButtonClass?: string
}

const Navbar: React.FC<NavbarProps> = ({
  children,
  title,
  titleClass,
  enableBackButton,
  backButtonClass,
}) => {
  const backBtnClass = backButtonClass ?? 'icon--stroke-primary'
  const navigate = useNavigate()

  const handleBack = (): void => {
    navigate(-1)
  }

  return (
    <div className="navbar">
      {enableBackButton && (
        <button className="btn btn-clear" type="button" onClick={handleBack}>
          <ArrowLeftSvg className={backBtnClass} />
        </button>
      )}
      <div className="flex-align-center flex-space-between flex-1">
        <span className={titleClass}>{title}</span>
        {children}
      </div>
    </div>
  )
}

export default Navbar

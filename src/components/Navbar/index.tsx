type NavbarProps = {
  children: JSX.Element
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  return <div className='navbar'>{children}</div>
}

export default Navbar

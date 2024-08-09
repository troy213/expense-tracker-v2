import { Navbar, Toolbar } from '@/components'
import CategoryTabView from './CategoryTabView'

interface ThemeProps {
  theme: string
}

const Categories: React.FC<ThemeProps> = ({ theme }) => {
  return (
    <div className={`categories ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex-column flex-1 gap-4 p-4">
        <Navbar enableBackButton={true} title="Category & Budget" />

        <CategoryTabView />
      </div>
      <Toolbar />
    </div>
  )
}

export default Categories

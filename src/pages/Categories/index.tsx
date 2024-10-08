import { Navbar, Toolbar } from '@/components'
import CategoryTabView from './CategoryTabView'

const Categories = () => {
  return (
    <div className="categories">
      <div className="flex-column flex-1 gap-4 p-4">
        <Navbar enableBackButton={true} title="CategoryAndBudget" />

        <CategoryTabView />
      </div>
      <Toolbar />
    </div>
  )
}

export default Categories

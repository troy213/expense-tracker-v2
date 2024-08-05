import { Navbar, Toolbar } from '@/components'
import CategoryTabView from './CategoryTabView'

const Categories = () => {
  return (
    <div className='categories'>
      <div className='p-4 flex-column flex-1 gap-4'>
        <Navbar enableBackButton={true}>
          <span>Category & Budget</span>
        </Navbar>

        <CategoryTabView />
      </div>
      <Toolbar />
    </div>
  )
}

export default Categories

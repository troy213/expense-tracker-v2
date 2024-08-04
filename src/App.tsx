import { Routes, Route } from 'react-router-dom'
import { Categories, Dashboard, NotFound, Reports, Settings } from '@/pages'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/categories' element={<Categories />} />
      <Route path='/reports' element={<Reports />} />
      <Route path='/settings' element={<Settings />} />

      {/* 404 not found */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App

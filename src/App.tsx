import { Routes, Route } from 'react-router-dom'
import { Categories, Dashboard, Language, NotFound, Reports, Settings, Theme } from '@/pages'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/categories' element={<Categories />} />
      <Route path='/reports' element={<Reports />} />
      <Route path='/settings' element={<Settings />} />
      <Route path='/theme' element={<Theme />} />
      <Route path='/language' element={<Language />} />

      {/* 404 not found */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App

import { Routes, Route } from 'react-router-dom'
import {
  Categories,
  Dashboard,
  Language,
  NotFound,
  Reports,
  Settings,
  Theme,
} from '@/pages'
import useAppSelector from './hooks/useAppSelector'

const App = () => {
  const theme = useAppSelector((state) => state.themeReducer.theme)

  return (
    <Routes>
      <Route path="/" element={<Dashboard theme={theme} />} />
      <Route path="/categories" element={<Categories theme={theme} />} />
      <Route path="/reports" element={<Reports theme={theme} />} />
      <Route path="/settings" element={<Settings theme={theme} />}>
        <Route path="theme" element={<Theme />} />
        <Route path="language" element={<Language />} />
      </Route>

      {/* 404 not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

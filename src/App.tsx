import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { Categories, Dashboard, NotFound, Reports, Settings } from '@/pages'
import { Languages, SettingMenus, Theme } from '@/pages/Settings'
import useAppSelector from '@/hooks/useAppSelector'

const App = () => {
  const theme = useAppSelector((state) => state.mainReducer.theme)

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [theme])

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />}>
        <Route index element={<SettingMenus />} />
        <Route path="theme" element={<Theme />} />
        <Route path="language" element={<Languages />} />
      </Route>

      {/* 404 not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

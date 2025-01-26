import { IntlProvider } from 'react-intl'
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { LANGUAGES, LOCALES, THEME } from '@/constants'
import { useAppSelector, useInitConfig } from '@/hooks'
import { Categories, Dashboard, NotFound, Reports, Settings } from '@/pages'
import { About, Languages, SettingMenus, Theme } from '@/pages/Settings'

const App = () => {
  const { selectedLocale, theme } = useAppSelector((state) => state.mainReducer)
  const currentLanguage =
    LANGUAGES[selectedLocale] || LANGUAGES[LOCALES.ENGLISH]

  useInitConfig()

  useEffect(() => {
    if (theme === THEME.DARK) {
      document.body.classList.add(THEME.DARK)
    } else {
      document.body.classList.remove(THEME.DARK)
    }
  }, [theme])

  return (
    <IntlProvider
      locale={currentLanguage.locale}
      messages={currentLanguage.messages}
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />}>
          <Route index element={<SettingMenus />} />
          <Route path="about" element={<About />} />
          <Route path="theme" element={<Theme />} />
          <Route path="language" element={<Languages />} />
        </Route>

        {/* 404 not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </IntlProvider>
  )
}

export default App

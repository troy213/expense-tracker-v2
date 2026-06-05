import { IntlProvider } from 'react-intl'
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { Layout, PWAInstallPrompt } from '@/components'
import { LANGUAGES, LOCALES, THEME } from '@/constants'
import { useAppSelector, useInitConfig } from '@/hooks'
import { SpinnerSvg } from '@/assets'
import './App.scss'
import {
  Categories,
  Dashboard,
  NotFound,
  ReportDetail,
  Reports,
  Settings,
} from '@/pages'
import {
  About,
  AdvancedSetting,
  Languages,
  SettingMenus,
  Theme,
} from '@/pages/Settings'

const App = () => {
  const { locale, theme, isInitialized } = useAppSelector(
    (state) => state.configReducer
  )
  const currentLanguage = LANGUAGES[locale] || LANGUAGES[LOCALES.ENGLISH]

  useInitConfig()

  // Resolve the theme preference to a concrete `data-theme` on <html>.
  // 'system' follows the OS and updates live; 'light'/'dark' are applied as-is.
  // The pre-paint script in index.html sets this first to avoid a flash.
  useEffect(() => {
    const root = document.documentElement
    const mql = window.matchMedia('(prefers-color-scheme: dark)')

    const apply = () => {
      const resolved =
        theme === THEME.SYSTEM
          ? mql.matches
            ? THEME.DARK
            : THEME.LIGHT
          : theme
      root.dataset.theme = resolved
    }

    apply()

    if (theme === THEME.SYSTEM) {
      mql.addEventListener('change', apply)
      return () => mql.removeEventListener('change', apply)
    }
  }, [theme])

  if (!isInitialized) {
    return (
      <div className="app-loading">
        <SpinnerSvg className="icon--2xl icon--color-white spin" />
      </div>
    )
  }

  return (
    <IntlProvider
      locale={currentLanguage.locale}
      messages={currentLanguage.messages}
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/report-detail" element={<ReportDetail />} />
          <Route path="/settings" element={<Settings />}>
            <Route index element={<SettingMenus />} />
            <Route path="about" element={<About />} />
            <Route path="theme" element={<Theme />} />
            <Route path="language" element={<Languages />} />
            <Route path="advanced-setting" element={<AdvancedSetting />} />
          </Route>
        </Route>

        {/* 404 not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <PWAInstallPrompt />
    </IntlProvider>
  )
}

export default App

import { IntlProvider } from 'react-intl'
import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { Layout, PWAInstallPrompt } from '@/components'
import { LANGUAGES, LOCALES, THEME } from '@/constants'
import { useAppSelector, useInitConfig } from '@/hooks'
import { SpinnerSvg } from '@/assets'
import './App.scss'
// Dashboard is the landing route, so it stays in the main bundle — lazy-loading
// it would add a chunk round trip before first paint on the most-visited page.
// Every other route is split into its own chunk via React.lazy; the PWA service
// worker precaches those chunks, so navigation is instant after the first load.
import Dashboard from '@/pages/Dashboard'

const Categories = lazy(() => import('@/pages/Categories'))
const Reports = lazy(() => import('@/pages/Reports'))
const ReportDetail = lazy(() => import('@/pages/ReportDetail'))
const NotFound = lazy(() => import('@/pages/404'))
const Settings = lazy(() => import('@/pages/Settings'))
const About = lazy(() => import('@/pages/Settings/About'))
const AdvancedSetting = lazy(() => import('@/pages/Settings/AdvancedSetting'))
const Languages = lazy(() => import('@/pages/Settings/Languages'))
const SettingMenus = lazy(() => import('@/pages/Settings/SettingMenus'))
const Theme = lazy(() => import('@/pages/Settings/Theme'))

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
      <Suspense
        fallback={
          <div className="app-loading">
            <SpinnerSvg className="icon--2xl icon--color-white spin" />
          </div>
        }
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
      </Suspense>

      <PWAInstallPrompt />
    </IntlProvider>
  )
}

export default App

// src/Root.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import App from './App'
import './main.scss'
import english from './locales/en-US'
import indo from './locales/id-Id'
import useAppSelector from './hooks/useAppSelector'

interface Messages {
  [key: string]: {
    locale: string
    messages: Record<string, string>
  }
}

const locales: Messages = {
  'id-ID': indo,
  'en-US': english,
}

const Root: React.FC = () => {
  const lang = useAppSelector((state) => state.mainReducer.lang)
  const currentLocale = locales[lang] || locales['en-US']

  return (
    <IntlProvider
      locale={currentLocale.locale}
      messages={currentLocale.messages}
    >
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </IntlProvider>
  )
}

export default Root

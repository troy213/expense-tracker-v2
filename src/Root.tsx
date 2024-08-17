import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import { useAppSelector } from '@/hooks'
import App from './App'
import { english, indonesia } from './locales'
import './main.scss'
interface Messages {
  [key: string]: {
    locale: string
    messages: Record<string, string>
  }
}

const locales: Messages = {
  'id-ID': indonesia,
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

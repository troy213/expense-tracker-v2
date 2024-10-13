import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import App from './App.tsx'
import './main.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Provider store={store}>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </Provider>
      </Router>
    </Provider>
  </React.StrictMode>
)

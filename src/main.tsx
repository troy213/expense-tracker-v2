import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import App from './App.tsx'
import store from './store'
import './main.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </Provider>
    </Router>
  </React.StrictMode>
)

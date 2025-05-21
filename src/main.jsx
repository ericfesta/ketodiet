import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import './i18n.js'

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'))

// Render app with StrictMode for development checks
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

// Enable HMR for development
if (import.meta.hot) {
  import.meta.hot.accept()
}

import * as React from 'react'
import ReactDOM from 'react-dom/client'

import './styles/index.css'

import AppWithProviders from './providers'

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <AppWithProviders />
    </React.StrictMode>
  )
}

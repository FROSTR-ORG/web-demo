import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './components/app.js'

import '@/styles/global.css'
import '@/styles/connected.css'
import '@/styles/options.css'

// Fetch the root container.
const container = document.getElementById('root')

// If the root container is not found, throw an error.
if (!container) throw new Error('[ app ] root container not found')

// Create the react root element.
const root = createRoot(container)

// Render the app.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

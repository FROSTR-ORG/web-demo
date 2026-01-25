import { StrictMode }    from 'react'
import { createRoot }    from 'react-dom/client'
import { BifrostProvider }  from '@/context/bifrost.js'
import { StoreProvider } from '@/store/index.js'
import { App }           from '@/components/layout/app.js'

import '@/styles/global.css'
import '@/styles/layout.css'
import '@/styles/node.css'
import '@/styles/settings.css'

// Fetch the root container.
const container = document.getElementById('root')

// If the root container is not found, throw an error.
if (!container) throw new Error('[ app ] root container not found')

// Create the react root element.
const root = createRoot(container)

// Render the app.
root.render(
  <StrictMode>
    <StoreProvider>
      <BifrostProvider>
        <App />
      </BifrostProvider>
    </StoreProvider>
  </StrictMode>
)

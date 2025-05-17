import { Store } from '@/class/store.js'

import Header      from './header.js'
import Settings    from './settings/index.js'
import NodeService from './node/service.js'

import type{ AppStore } from '@/types/index.js'

const DEFAULT_STORE : AppStore = {
  group  : null,
  share  : null,
  relays : [],
  peers  : [],
}

export default function App() {

  const store = new Store('frostr-web', DEFAULT_STORE)

  return (
    <div className="app">
      <Header />
      <Settings store={store} />
      <NodeService store={store} />
    </div>
  )
}
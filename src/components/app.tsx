import { Store } from '@/class/store.js'

import Header     from './header.js'
import NodeConfig from './node/index.js'

const DEFAULT_STORE = {
  name: 'Frost'
}

export default function App() {

  const store = new Store('frostr-web', DEFAULT_STORE)

  return (
    <div className="app">
      <Header />
      <NodeConfig store={store} />
    </div>
  )
}
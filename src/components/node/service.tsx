import { Store }                   from '@/class/store.js'
import { BifrostNode, PeerPolicy } from '@frostr/bifrost'

import {
  useEffect,
  useState
} from 'react'

import type { AppStore, StoreParams } from '@/types/index.js'

export default function NodeService ({ store } : StoreParams) {
  // State for logs
  const [ node, setNode ] = useState<BifrostNode | null>(null)

  useEffect(() => {
    // Subscribe to store changes
    const unsubscribe = store.subscribe(() => {
      const node = init_node(store)
      setNode(node)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [ store ])

  return (
    <div className="node-container">
      <h2 className="section-header">Bifrost Node</h2>
      <p className="description">Bifrost Node Service</p>
      <p>Status {node?.pubkey}</p>
    </div>
  )
}

function init_node (store : Store<AppStore>) {
  const { group, share, relays } = store.get()

  if (group !== null && share !== null && relays.length > 0) {
    const urls  = relays.map(e => e.url)
    const peers = group.commits.map(e => [ e.pubkey, false, false ]) as PeerPolicy[]
    store.update({ peers })
    const node  = new BifrostNode(group, share, urls, { policies : peers })
    node.once('ready', () => {
      console.log('node ready')
    })
    node.once('error', (error) => {
      console.error('node error:', error)
    })

    return node
  } else {
    return null
  }
}

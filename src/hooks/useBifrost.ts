import { BifrostNode }       from '@frostr/bifrost'
import { useStore }          from '@/store/index.js'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { MutableRefObject } from 'react'

import type {
  AppStore,
  NodeStatus,
  StoreReady
} from '@/types/index.js'

interface BifrostNodeAPI {
  ref    : MutableRefObject<BifrostNode | null>
  reset  : () => void
  stop   : () => void
  status : NodeStatus
}

export function useBifrost () : BifrostNodeAPI {
  const [ status, setStatus ] = useState<NodeStatus>('stopped')

  const store = useStore()
  const ref   = useRef<BifrostNode | null>(null)

  const reset = () => {
    if (!is_store_ready(store.data)) return

    const { creds, relays, peers } = store.data

    const urls = relays.map(r => r.url)

    ref.current = new BifrostNode(creds.group, creds.share, urls, { policies : peers })

    ref.current.once('ready', () => {
      console.log('node ready')
      setStatus('online')
    })

    ref.current.once('error', (error) => {
      console.error('node error:', error)
      setStatus('offline')
    })

    ref.current.on('closed', () => {
      console.log('node closed')
      setStatus('offline')
    })
  }

  const stop = () => {
    if (!ref.current) return
    ref.current = null
  }

  useEffect(() => {
    reset()
  }, [ store.data.creds, store.data.relays, store.data.peers ])

  return { ref, reset, stop, status }
}

function is_store_ready (store : AppStore) : store is StoreReady {
  return store.creds !== null && store.relays.length > 0
}

import { BifrostNode } from '@frostr/bifrost'
import { useStore }    from '@/store/index.js'
import { LOG_LIMIT }   from '@/const.js'

import { useEffect, useRef, useState } from 'react'

import type {
  AppStore,
  NodeStatus,
  StoreReady,
  NodeAPI,
  LogEntry,
  LogType
} from '@/types/index.js'

export function useBifrost () : NodeAPI {
  const [ status, setStatus ] = useState<NodeStatus>('stopped')

  const store     = useStore()
  const node_ref  = useRef<BifrostNode | null>(null)
  const store_ref = useRef(store.data)

  useEffect(() => {
    store_ref.current = store.data
  }, [store.data])

  const reset = () => {
    if (!is_store_ready(store.data)) return

    store.update({ logs: [] })

    const { creds, peers, relays } = store.data

    const urls = relays.map(r => r.url)

    node_ref.current = new BifrostNode(creds.group, creds.share, urls, { policies : peers })

    node_ref.current.once('ready', () => {
      console.log('node ready')
      setStatus('online')
    })

    node_ref.current.once('error', (error) => {
      console.error('node error:', error)
      setStatus('offline')
    })

    node_ref.current.once('closed', () => {
      console.log('node closed')
      setStatus('offline')
    })

    node_ref.current.on('*', (event, data) => {
      if (event === 'message')       return
      if (event.startsWith('/ping')) return

      const log = {
        timestamp : new Date().toISOString(),
        message   : String(event),
        type      : 'info' as LogType
      }
      
      store.update({ logs: update_log(store_ref.current, log) })

      console.log('event received:', event)
      console.dir(data, { depth : null })
    })

    node_ref.current.connect()
  }

  const stop = () => {
    if (!node_ref.current) return
    node_ref.current = null
  }

  useEffect(() => {
    reset()
  }, [ store.data.creds, store.data.relays, store.data.peers ])

  return { ref: node_ref, reset, stop, status }
}

function is_store_ready (store : AppStore) : store is StoreReady {
  return store.creds !== null && store.relays.length > 0
}

function update_log (store : AppStore, log : LogEntry) {
  let new_logs = [ ...store.logs, log ]
  if (new_logs.length > LOG_LIMIT) {
    const diff = new_logs.length - LOG_LIMIT
    new_logs = new_logs.slice(diff)
  }
  return new_logs
}

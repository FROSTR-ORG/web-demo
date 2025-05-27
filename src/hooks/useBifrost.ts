import { BifrostNode } from '@frostr/bifrost'
import { useStore }    from '@/store/index.js'
import { LOG_LIMIT }   from '@/const.js'

import { useEffect, useRef, useState, useMemo } from 'react'

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

  // Keep store_ref in sync with store.data
  useEffect(() => {
    store_ref.current = store.data
  }, [ store.data ])

  const reset = () => {
    if (!is_store_ready(store.data)) return

    // Clear logs when resetting
    store.update({ logs: [] })

    // Get the group, share, peers, and relays from the store.
    const { group, share, peers, relays } = store.data

    // Get the URLs from the relays.
    const urls = relays.map(r => r.url)

    // Create a new node.
    node_ref.current = new BifrostNode(group, share, urls, { policies : peers })

    node_ref.current.on('ready', () => {
      node_ref.current?.req.echo('echo')
      console.log('bifrost node initialized')
      setStatus('online')
    })

    node_ref.current.on('closed', () => {
      setStatus('offline')
    })

    node_ref.current.on('error', (error) => {
      setStatus('offline')
    })

    node_ref.current.on('*', (event, data) => {
      // Skip message events.
      if (event === 'message') return
      if (event.startsWith('/ping')) return

      let type: LogType = 'info' // Default log type
      let message = String(event)
      let payload: any = data

      // Determine log type and refine message based on event string
      if (message.toLowerCase() === 'ready') {
        type = 'ready'
        payload = undefined // No payload for ready events
      } else if (message.startsWith('/sign')) {
        type = 'sign' // General sign type, can be refined
        if (message.endsWith('/req')) {
          type = 'req'
        } else if (message.endsWith('/res')) {
          type = 'res'
        }
      } else if (message.startsWith('/error')) {
        type = 'error'
      } // Add more specific event type handling as needed

      // If payload is an empty object, set it to undefined so no dropdown is shown
      if (typeof payload === 'object' && payload !== null && Object.keys(payload).length === 0) {
        payload = undefined
      }

      const log_entry: LogEntry = {
        timestamp: Date.now(),
        message: message,
        type: type,
        payload: payload
      }

      // console.log('event:', event, 'data:', data, 'log_entry:', log_entry)
      const logs = update_log(store_ref.current, log_entry)
      store.update({ logs })
    })

    node_ref.current.connect()
  }

  const stop = () => {
    node_ref.current = null
  }

  // Reset node when core configuration changes
  useEffect(() => {
    reset()
  }, [ store.data.group, store.data.share, store.data.relays ])

  return useMemo(() => ({
    ref: node_ref,
    reset,
    stop,
    status
  }), [ reset, stop, status ])
}

function is_store_ready (store : AppStore) : store is StoreReady {
  return store.group !== null && store.share !== null && store.relays.length > 0
}

function update_log (store : AppStore, log : LogEntry) {
  let new_logs = [ ...store.logs, log ]
  if (new_logs.length > LOG_LIMIT) {
    const diff = new_logs.length - LOG_LIMIT
    new_logs = new_logs.slice(diff)
  }
  return new_logs
}

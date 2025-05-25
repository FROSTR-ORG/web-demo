import { sleep } from "@frostr/bifrost/util"

import { useEffect, useState } from 'react'

import { now }       from '@frostr/bifrost/util'
import { useNode }   from '@/context/node.js'
import { PING_IVAL } from '@/const.js'

import type { PeerStatus } from '@/types/index.js'

export function usePeerStatus () {
  const node = useNode()

  const [ is_init, setInit  ] = useState(false)
  const [ status, setStatus ] = useState<PeerStatus[]>([])

  const fetch_status = async () => {
    // If the node is not ready, or not online, do nothing.
    if (!node.ref.current?.is_ready) return
    // Get the current timestamp.
    const stamp = now()
    // Get the peers from the node.
    const peers = node.ref.current.peers
    // Only ping peers that have stale status.
    const stale = peers.filter(peer => peer.status === 'offline' || peer.updated < stamp - PING_IVAL)
    // If there are no stale peers, do nothing.
    if (stale.length === 0) return
    // Create an array of promises.
    const promises = []
    // For each stale peer,
    for (const peer of stale) {
      // Create a promise to ping the peer.
      const promise = node.ref.current.req.ping(peer.pubkey).then(pong => {
        // Update the status using the functional update pattern
        setStatus(prevStatus => {
          const new_status: PeerStatus = {
            pubkey: peer.pubkey,
            status: pong.ok ? 'online' : 'offline',
            updated: now()
          }
          return [...prevStatus.filter(p => p.pubkey !== peer.pubkey), new_status]
        })
      })
      // Add the promise to the array.
      promises.push(promise)
    }
    // Resolve all promises.
    return Promise.all(promises)
  }

  useEffect(() => {
    if (node.ref.current && status.length === 0) {
      // Create an initial status array from the node's peers.
      const init_status = node.ref.current.peers.map(peer => ({
        pubkey  : peer.pubkey,
        status  : 'checking' as PeerStatus['status'],
        updated : peer.updated
      }))
      // Set the status array to the initial status.
      setStatus(init_status)
    }
  }, [ node.ref ])

  useEffect(() => {
    if (node.ref.current && !is_init) {
      (async () => {
        await sleep(500)
        await fetch_status()
        setInit(true)
      })()
    }
  }, [ status ])

  useEffect(() => {
    const interval = setInterval(fetch_status, PING_IVAL * 1000)
    return () => clearInterval(interval)
  }, [ node.status, node.ref ])

  return { status, fetch_status }
}
import { useEffect, useState, useCallback } from 'react'

import { useNode }   from '@/context/node.js'
import { useStore }  from '@/store/index.js'
import { now, sleep }       from '@frostr/bifrost/util'
import { PING_IVAL } from '@/const.js'

interface PeerStatus {
  pubkey  : string
  status  : 'online' | 'offline'
  updated : number
}

export function PeerInfo() {
  const node  = useNode()
  const store = useStore()
  const [ status, setStatus ] = useState<PeerStatus[]>([])

  // Function to check peer status
  const checkPeerStatus = useCallback(async () => {
    console.log('checkPeerStatus')
    console.log('node.status', node.status)
    // If the node is not ready, or not online, do nothing.
    if (!node.ref.current || node.status !== 'online') return
    // Get the current timestamp.
    const stamp = now()
    // Get the peers from the node.
    const peers = node.ref.current.peers
    // Only ping peers that are properly configured with both send and recv policies
    const stale = peers.filter(peer => {
      return peer.updated < stamp - PING_IVAL
    })
    //
    const configs = []
    // For each stale peer,
    for (const peer of stale) {
      // Ping the peer.
      const pong = await node.ref.current.req.ping(peer.pubkey)
      // Update the status of the peer.
      setStatus(prev => {
        const updated = prev.filter(p => p.pubkey !== peer.pubkey)
        updated.push({
          pubkey  : peer.pubkey,
          status  : pong.ok ? 'online' : 'offline',
          updated : now()
        })
        return updated
      })
      // If the peer is online, add the updated config.
      if (pong.ok) configs.push(pong.data)
    }
    console.log('bifrost peers', node.ref.current.peers)
    // If there are any configs, update the store.
    // if (configs.length > 0) {
    //   store.update({ peers : configs })
    // }
  }, [ node.status, node.ref ])

  // Check peer status when the component mounts.
  useEffect(() => {
    sleep(1000).then(() => {
      checkPeerStatus()
    })
  }, [])

  // Check peer status periodically.
  useEffect(() => {
    const interval = setInterval(checkPeerStatus, PING_IVAL * 1000)
    return () => clearInterval(interval)
  }, [ checkPeerStatus ])

  return (
    <div className="dashboard-container">
      <h2 className="section-header">Peer Status</h2>
      {status.length === 0 ? (
        <p>waiting for peers...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Pubkey</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {status.map((peer) => (
              <tr key={peer.pubkey}>
                <td className="pubkey-cell">{peer.pubkey}</td>
                <td>
                  <span className={`status-indicator ${peer.status}`}>
                    {peer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button 
        className="button" 
        onClick={checkPeerStatus}
        disabled={node.status !== 'online'}
      >
        Refresh
      </button>
    </div>
  )
}

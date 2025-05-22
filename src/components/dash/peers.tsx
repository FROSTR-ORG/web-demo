import { useEffect, useState } from 'react'

import { useNode }   from '@/context/node.js'
import { useStore }  from '@/store/index.js'
import { now }       from '@frostr/bifrost/util'
import { PING_IVAL } from '@/const.js'
import { PeerConfig } from '@frostr/bifrost'

interface PeerStatus {
  pubkey : string
  status : 'online' | 'offline'
}

export function PeerInfo() {
  const node  = useNode()
  const store = useStore()
  const [ status, setStatus ] = useState<PeerStatus[]>([])

  // Function to check peer status
  const checkPeerStatus = async () => {
    if (!node.ref.current) return
    
    const stamp = now()
    const peers = node.ref.current.peers
    const stale = peers.filter(peer => peer.updated < stamp - PING_IVAL)

    console.log('peers', peers)
    console.log('stale', stale)

    const pings = []
    
    for (const peer of stale) {
      pings.push(node.ref.current.req.ping(peer.pubkey).then(pong => {
        const updated = [ ...status.filter(p => p.pubkey !== peer.pubkey) ]
        updated.push({
          pubkey : peer.pubkey,
          status : pong.ok ? 'online' : 'offline'
        })
        setStatus(updated)
      }))
    }

    console.log('pings', pings)

    await Promise.all(pings)

    store.update({ peers : node.ref.current.peers })
  }

  // Check peer status periodically
  useEffect(() => {
    if (node.status !== 'online') return

    // Initial check
    checkPeerStatus()

    // Set up periodic checks
    const interval = setInterval(checkPeerStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

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

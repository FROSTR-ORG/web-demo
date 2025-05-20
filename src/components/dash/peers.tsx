import { useEffect, useState } from 'react'

import { useNode }  from '@/context/node.js'
import { useStore } from '@/store/index.js'

interface PeerStatus {
  pubkey : string
  status : 'online' | 'offline'
}

export function PeerInfo() {
  const node  = useNode()
  const store = useStore()
  const [ peerStatus, setPeerStatus ] = useState<PeerStatus[]>([])

  // Function to check peer status
  const checkPeerStatus = async () => {
    if (!node.ref.current) return

    const pongs = await node.ref.current.req.ping()

    console.log(pongs)

    if (!pongs.ok) return

    const peers    = node.ref.current.peers
    const policies = peers.map(peer => ({
      pubkey : peer.pubkey,
      send   : peer.policy.send,
      recv   : peer.policy.recv
    }))

    store.update({ peers : policies })

    const stats : PeerStatus[] = []

    for (const peer of peers) {
      stats.push({
        pubkey   : peer.pubkey,
        status   : peer.status
      })
    }

    setPeerStatus(stats)
  }

  // Check peer status periodically
  useEffect(() => {
    if (node.status !== 'online') return

    // Initial check
    checkPeerStatus()

    // Set up periodic checks
    const interval = setInterval(checkPeerStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [ node.status ])

  return (
    <div className="dashboard-container">
      <h2 className="section-header">Peer Status</h2>
      {peerStatus.length === 0 ? (
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
            {peerStatus.map((peer) => (
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

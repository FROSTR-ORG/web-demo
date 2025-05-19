import { useEffect, useState } from 'react'
import { useStore } from '@/store/index.js'

import type { PeerPolicy } from '@frostr/bifrost'

export function PeerConfig() {
  const store = useStore()

  const [ peers, setPeers ]     = useState<PeerPolicy[]>(store.data.peers)
  const [ changes, setChanges ] = useState<boolean>(false)
  const [ saved, setSaved ]     = useState<boolean>(false)

  // Update the peer policies in the store.
  const update = () => {
    store.update({ peers })
    setChanges(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  // Discard changes by resetting local state from store
  const cancel = () => {
    setPeers(store.data.peers)
    setChanges(false)
  }

  // Update peer connectivity status locally
  const update_peer = (idx: number, key: number, value: boolean) => {
    setPeers(prev => {
      const updated = [ ...prev ?? [] ]
      updated[idx][key] = value
      return updated
    })
    setChanges(true)
  }

  useEffect(() => {
    setPeers(store.data.peers)
  }, [ store.data.peers ])

  return (
    <div className="container">
      <h2 className="section-header">Peer Connections</h2>
      <p className="description">Configure how you communicate with other peers in your signing group. "Request" will send signature requests to that peer, and "Respond" will co-sign requests from that peer.</p>

      {peers === null &&
        <p className="description">You must configure your node's credentials first.</p>
      }
      
      {peers !== null &&
        <div>
          <table>
            <thead>
              <tr>
                <th>Peer Public Key</th>
                <th className="checkbox-cell">Request</th>
                <th className="checkbox-cell">Respond</th>
              </tr>
            </thead>
            <tbody>
              {peers.map((peer, idx) => (
                <tr key={idx}>
                  <td className="pubkey-cell">{peer[0]}</td>
                  <td className="checkbox-cell">
                    <input
                      type="checkbox"
                      className="peer-checkbox"
                      checked={peer[1]}
                      onChange={() => update_peer(idx, 1, !peer[1])}
                    />
                  </td>
                  <td className="checkbox-cell">
                    <input
                      type="checkbox"
                      className="peer-checkbox"
                      checked={peer[2]}
                      onChange={() => update_peer(idx, 2, !peer[2])}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="action-buttons">
            <button 
              onClick={update}
              disabled={!changes}
              className={`button button-primary action-button ${saved ? 'saved-button' : ''}`}
            >
              {saved ? 'Saved' : 'Save'}
            </button>
            
            {changes && (
              <button 
                onClick={cancel}
                className="button"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      }
    </div>
  )
}

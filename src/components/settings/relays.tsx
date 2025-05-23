import { useEffect, useState } from 'react'
import { useStore }            from '@/store/index.js'

import type { RelayPolicy } from '@/types/index.js'

export function RelayConfig() {
  const store = useStore()

  const [ relays, setRelays ]   = useState<RelayPolicy[]>(store.data.relays)
  const [ relayUrl, setUrl ]    = useState('')
  const [ changes, setChanges ] = useState<boolean>(false)
  const [ error, setError ]     = useState<string | null>(null)
  const [ saved, setSaved ]     = useState<boolean>(false)

  // Update the peer policies in the store.
  const update = () => {
    // TODO: PWA storage update
    store.update({ relays })
    setChanges(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  // Discard changes by resetting local state from store
  const cancel = () => {
    setRelays(store.data.relays)
    setChanges(false)
  }
  
  // Update relay enabled status locally
  const update_relay = (idx: number, key: 'read' | 'write') => {
    const policies = [ ...relays ]
    policies[idx][key] = !policies[idx][key]
    setRelays(policies)
    setChanges(true)
  }
  
  // Add a new relay to local state
  const add_relay = () => {  
    if (!relayUrl.trim()) return
    
    if (!(relayUrl.startsWith('wss://') || relayUrl.startsWith('ws://'))) {
      setError('Relay URL must start with wss:// or ws://')
    } else if (!validateUrl(relayUrl)) {
      setError('Invalid URL format')
    } else if (relays.some(relay => relay.url === relayUrl)) {
      setError('Relay already exists')
    } else {
      setRelays(prev => [ ...prev, { url: relayUrl, read: true, write: true } ])
      setUrl('')
      setChanges(true)
    }
  }
  
  // Remove a relay from local state
  const remove_relay = (idx: number) => {
    const filtered = relays.filter((_, i) => i !== idx)
    setRelays(filtered)
    setChanges(true)
  }

  useEffect(() => {
    // Parse the URL parameters for relay URLs.
    const params = new URLSearchParams(window.location.search)
    // Get all the relay URLs from the URL parameters.
    const urls   = params.getAll('r')
    // If there are no relay URLs, return.
    if (urls.length === 0) return
    // Create an array of relay policies to add.
    const updates : RelayPolicy[] = []
    // For each relay URL,
    for (const url of urls) {
      // If the relay URL is not already in the list, add it.
      if (!relays.some(relay => relay.url === url)) {
        updates.push({ url, read: true, write: true })
      }
    }
    // If there are no updates, return.
    if (updates.length === 0) return
    // Add the relay policies to the store.
    store.update({ relays : [ ...relays, ...updates ] })
  }, [])

  useEffect(() => {
    if (error !== null) setError(null)
  }, [ relayUrl ])

  useEffect(() => {
    setRelays(store.data.relays)
  }, [ store.data.relays ])
  
  return (
    <div className="container">
      <h2 className="section-header">Relay Connections</h2>
      <p className="description">Configure which relays your node will use to communicate. "Read" will enable listening for inbound requests, and "Write" will enable publishing outbound requests.</p>
      
      <table>
        <thead>
          <tr>
            <th className="url-column">Relay URL</th>
            <th className="checkbox-cell">Read</th>
            <th className="checkbox-cell">Write</th>
            <th className="action-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {relays.map((relay, idx) => (
            <tr key={idx}>
              <td>{relay.url}</td>
              <td className="checkbox-cell">
                <input
                  type="checkbox"
                  className="relay-checkbox"
                  checked={relay.read}
                  onChange={() => update_relay(idx, 'read')}
                />
              </td>
              <td className="checkbox-cell">
                <input
                  type="checkbox"
                  className="relay-checkbox"
                  checked={relay.write}
                  onChange={() => update_relay(idx, 'write')}
                />
              </td>
              <td className="action-cell">
                <button 
                  onClick={() => remove_relay(idx)} 
                  className="button button-remove"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="input-group relay-controls">
        <input
          type="text"
          value={relayUrl}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="wss://relay.example.com"
          className="relay-input"
        />
        <button onClick={add_relay} className="button add-relay-button">
          Add Relay
        </button>
      </div>
      
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
        <div className="notification-container">
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  )
}

function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}
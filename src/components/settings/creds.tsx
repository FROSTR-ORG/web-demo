import { useEffect, useState } from 'react'
import { get_pubkey }          from '@frostr/bifrost/util'
import { useStore }            from '@/store/index.js'
import { QRScanner }           from '@/components/util/scanner.js'

import {
  decode_credentials,
  encode_credentials
} from '@frostr/bifrost/encoder'

import type { PeerConfig, PeerPolicy }      from '@frostr/bifrost'
import type { NodeCredentials } from '@/types/node.js'

export function CredentialsConfig() {
  const store = useStore()

  const [ input, setInput ] = useState<string>('')
  const [ error, setError ] = useState<string | null>(null)
  const [ show, setShow   ] = useState<boolean>(false)
  const [ saved, setSaved ] = useState<boolean>(false)
  const [ isScanning, setIsScanning ] = useState<boolean>(false)

  /**
   * Handle the update of the store.
   */
  const update_creds = () => {
    // If an error exists, do not update the group.
    if (error !== null) return
    // If the input is empty,
    if (input === '') {
      store.update({ creds : null, peers : [] })
    } else {
      try {
        // Parse the input into a group package.
        const creds = decode_credentials(input)
        // Initialize the peers.
        const peers = init_peer_permissions(creds)
        // If the credentials package is invalid, return.
        if (creds === null) return
        // Update the credentials in the store.
        store.update({ creds, peers })
      } catch (err) {
        console.log(err)
        setError('failed to decode package data')
      }
    }
    // Set the saved state, and reset it after a short delay.
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  useEffect(() => {
    try {
      if (store.data.creds !== null) {
        setInput(get_creds_str(store.data.creds))
      } else {
        setInput('')
      }
    } catch {
      setInput('')
    }
  }, [ store.data.creds ])

  /**
   * Handle the validation of the input when it changes.
   */
  useEffect(() => {
    // If the input is empty, clear the error.
    if (input === '') {
      setError(null)
    } else if (!input.startsWith('bfcred')) {
      // If the input does not start with "bfcred", set an error.
      setError('input must start with "bfcred"')
    } else if (!is_cred_string(input)) {
      // If the input contains invalid characters, set an error.
      setError('input contains invalid characters')
    } else {
      // Parse the input into a credential package.
      const pkg = get_creds_pkg(input)
      // If the credential package is valid, clear the error.
      if (pkg !== null) {
        setError(null)
      } else {
        // If the credential package is invalid, set an error.
        setError('failed to decode package data')
      }
    }
  }, [ input ])

  return (
    <div className="container">
      <h2 className="section-header">Credentials Package</h2>
      <p className="description">Paste your encoded credentials string (starts with bfcred). It contains your secrets, plus information about your signing group.</p>
      <div className="content-container">
        <div className="input-with-button">
          <input
            type={show ? "text" : "password"}
            value={input}
            onChange={e => setInput(e.target.value.trim())}
            placeholder="bfcred1..."
          />
          <div className="input-actions">
            <button 
              className="button"
              onClick={() => setShow(!show)}
            >
              {show ? 'hide' : 'show'}
            </button>
            <button
              className="button"
              onClick={() => setIsScanning(!isScanning)}
            >
              {isScanning ? 'stop scan' : 'scan'}
            </button>
            <button
              className={`button action-button ${saved ? 'saved-button' : ''}`} 
              onClick={update_creds}
              disabled={!is_creds_changed(input, store.data.creds) || error !== null}
            >
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
        
        {isScanning && (
          <QRScanner
            onResult={(result: string) => {
              setInput(result.trim())
              setIsScanning(false)
            }}
            onError={(error: Error) => {
              console.error('QR scan error:', error)
            }}
          />
        )}
        
        {input !== '' && error === null && show && (
          <pre className="code-display">
            {get_creds_json(input) ?? 'invalid group package'}
          </pre>
        )}
        <div className="notification-container">
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  )
}

/**
 * Check if the input is a valid credential string.
 */
function is_cred_string(input : string) {
  return /^bfcred1[023456789acdefghjklmnpqrstuvwxyz]+$/.test(input)
}

/**
 * Check if the input has changed and is valid.
 */
function is_creds_changed (
  input : string,
  creds : NodeCredentials | null
) {
  if (creds === null) {
    return input !== ''
  } else {
    // Encode the existing credentials to a string.
    const creds_str = get_creds_str(creds)
    // Determine if the credentials input has changed and is valid.
    return input !== creds_str
  }
}

/**
 * Get the credentials string from the package.
 */
function get_creds_str (creds : NodeCredentials) {
  try {
    return (creds !== null)
      ? encode_credentials(creds.group, creds.share)
      : ''
  } catch {
    return ''
  }
}

/**
 * Get the credentials package from the input.
 */
function get_creds_pkg (input : string) {
  try {
    return (input !== '')
      ? decode_credentials(input)
      : null
  } catch {
    return null
  }
}

/**
 * Get the credentials JSON from the input.
 */
function get_creds_json(input : string) {
  try {
    const creds = decode_credentials(input)
    return JSON.stringify(creds, null, 2)
  } catch (err) {
    return null
  }
}

/**
 * Initialize the peer permissions.
 */
function init_peer_permissions (
  creds : NodeCredentials
) : PeerConfig[] {
  const pubkey = get_pubkey(creds.share.seckey, 'ecdsa')
  return creds.group.commits
    .filter(commit => commit.pubkey !== pubkey)
    .map(commit => ({
      pubkey : commit.pubkey,
      send   : false,
      recv   : true
    }))
}

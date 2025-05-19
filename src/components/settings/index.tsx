import { CredentialsConfig } from './creds.js'
import { PeerConfig }        from './peers.js'
import { RelayConfig }       from './relays.js'

export function Settings () {
  return (
    <>
      <CredentialsConfig />
      <PeerConfig        />
      <RelayConfig       />
    </>
  )
}

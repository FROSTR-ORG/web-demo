import { CredentialsConfig } from './creds.js'
import { PeerConfig }        from './peers.js'
import { RelayConfig }       from './relays.js'
import { ResetStore }        from './reset.js'

export function Settings () {
  return (
    <>
      <CredentialsConfig />
      <PeerConfig        />
      <RelayConfig       />
      <ResetStore        />
    </>
  )
}

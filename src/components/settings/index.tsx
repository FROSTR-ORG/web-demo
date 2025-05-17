import GroupPackageConfig    from './group.js'
import PeerNodeConfig        from './peers.js'
import RelayConfig           from './relays.js'
import SecretPackageConfig   from './share.js'

import { StoreParams } from '@/types/index.js'

export default function ({ store } : StoreParams) {
  return (
    <>
      <SecretPackageConfig store={store} />
      <GroupPackageConfig  store={store} />
      <PeerNodeConfig      store={store} />
      <RelayConfig         store={store} />
    </>
  )
}

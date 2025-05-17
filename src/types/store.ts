import type { Store } from '@/class/store.js'

import type {
  GroupPackage,
  SharePackage,
  PeerPolicy
} from '@frostr/bifrost'

export interface AppStore {
  group  : GroupPackage  | null
  share  : SharePackage  | null
  relays : RelayPolicy[]
  peers  : PeerPolicy[]
}

export interface StoreParams {
  store : Store<AppStore>
}

export interface RelayPolicy {
  url   : string
  read  : boolean
  write : boolean
}

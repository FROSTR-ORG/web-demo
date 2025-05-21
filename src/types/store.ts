import type {
  LogEntry,
  RelayPolicy
} from '@/types/node.js'

import type {
  GroupPackage,
  PeerConfig,
  SharePackage
} from '@frostr/bifrost'

export type AppStore = StoreInit | StoreReady

export interface BaseStore {
  relays : RelayPolicy[]
  peers  : PeerConfig[]
  logs   : LogEntry[]
}

export interface StoreInit extends BaseStore {
  group : null
  share : null
}

export interface StoreReady extends BaseStore {
  group : GroupPackage
  share : SharePackage
}

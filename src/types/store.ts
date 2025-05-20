import type {
  LogEntry,
  NodeCredentials,
  RelayPolicy
} from '@/types/node.js'

import type {
  PeerConfig
} from '@frostr/bifrost'

export type AppStore = StoreInit | StoreReady

export interface BaseStore {
  relays : RelayPolicy[]
  peers  : PeerConfig[]
  logs   : LogEntry[]
}

export interface StoreInit extends BaseStore {
  creds : null
}

export interface StoreReady extends BaseStore {
  creds : NodeCredentials
}

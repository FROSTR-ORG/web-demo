import type {
  LogEntry,
  NodeCredentials,
  RelayPolicy
} from '@/types/node.js'

import type {
  PeerPolicy
} from '@frostr/bifrost'

export type AppStore = StoreInit | StoreReady

export interface BaseStore {
  relays : RelayPolicy[]
  peers  : PeerPolicy[]
  logs   : LogEntry[]
}

export interface StoreInit extends BaseStore {
  creds : null
}

export interface StoreReady extends BaseStore {
  creds : NodeCredentials
}

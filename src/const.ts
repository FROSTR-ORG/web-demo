import type { AppStore } from './types/index.js'

export const LOG_LIMIT = 100

export const PING_IVAL = 5

export const STORE_KEY = 'frostr-demo'

export const DEFAULT_STORE : AppStore = {
  group  : null,
  share  : null,
  relays : [],
  peers  : [],
  logs   : []
}

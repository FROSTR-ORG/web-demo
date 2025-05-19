import type { AppStore } from './types/index.js'

export const STORE_KEY = 'frostr-demo'

export const DEFAULT_STORE : AppStore = {
  creds  : null,
  relays : [],
  peers  : [],
  logs   : []
}

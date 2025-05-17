import type { Store } from '@/class/store.js'

export interface AppStore {
  name: string
}

export interface StoreParams {
  store : Store<AppStore>
}

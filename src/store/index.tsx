import { DEFAULT_STORE, STORE_KEY } from '@/const.js'
import { DBController }             from './controller.js'
import { createStoreProvider }      from './context.js'

import type { AppStore } from '@/types/index.js'

const params = new URLSearchParams(window.location.search)
const name   = params.get('name')

const store_key = name ?
  `${STORE_KEY}-${name}`
  : STORE_KEY

export const StoreDB = new DBController<AppStore>(store_key, DEFAULT_STORE)
export const { StoreProvider, useStore } = createStoreProvider(StoreDB)

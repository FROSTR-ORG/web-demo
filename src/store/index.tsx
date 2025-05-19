import { DEFAULT_STORE, STORE_KEY } from '@/const.js'
import { DBController }             from './controller.js'
import { createStoreProvider }      from './context.js'

import type { AppStore } from '@/types/index.js'

export const StoreDB = new DBController<AppStore>(STORE_KEY, DEFAULT_STORE)
export const { StoreProvider, useStore } = createStoreProvider(StoreDB)

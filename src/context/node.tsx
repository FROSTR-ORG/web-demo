import { useBifrost } from '@/hooks/useBifrost.js'

import {
  createContext,
  useContext
} from 'react'

import type { ReactNode } from 'react'
import type { NodeAPI }   from '@/types/index.js'

interface ProviderProps {
  children : ReactNode
}

const Context = createContext<NodeAPI | null>(null)

export function NodeProvider ({ children }: ProviderProps): JSX.Element {

  const node = useBifrost()

  return (
    <Context.Provider value={node}>
      {children}
    </Context.Provider>
  )
}

export function useNode () {
  const ctx = useContext(Context)
  if (ctx === null) {
    throw new Error('useNode must be used within a NodeProvider')
  }
  return ctx
}

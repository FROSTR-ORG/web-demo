import type {
  BifrostNode,
  GroupPackage,
  SharePackage
} from '@frostr/bifrost'

import type { MutableRefObject } from 'react'

export type LogType    = 'info' | 'error' | 'warning' | 'success'
export type NodeStatus = 'stopped' | 'online' | 'offline'

export interface NodeAPI {
  ref    : MutableRefObject<BifrostNode | null>
  reset  : () => void
  stop   : () => void
  status : NodeStatus
}

export interface NodeCredentials {
  group : GroupPackage
  share : SharePackage
}

export interface LogEntry {
  timestamp : string
  message   : string
  type      : LogType
}

export interface RelayPolicy {
  url   : string
  read  : boolean
  write : boolean
}

import { GroupPackage, SharePackage } from '@frostr/bifrost'

export type NodeStatus = 'stopped' | 'online' | 'offline'

export interface NodeCredentials {
  group : GroupPackage
  share : SharePackage
}

export interface LogEntry {
  timestamp : string
  message   : string
  type      : 'info' | 'error' | 'warning' | 'success'
}

export interface RelayPolicy {
  url   : string
  read  : boolean
  write : boolean
}

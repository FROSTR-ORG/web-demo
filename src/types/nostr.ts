export interface EventTemplate {
    kind    : number
    content : string
    tags    : string[]
    [key: string] : any
  }
  
  export interface NostrEvent {
    kind: number
    content: string
    tags: string[]
    [key: string]: any
  }
  
  export interface SignedEvent {
    id         : string
    pubkey     : string
    created_at : number
    kind       : number
    content    : string
    tags       : string[][]
    sig        : string
  }
  
  
  export interface ProfilePointer {
    pubkey  : string
    relays? : string[]
  }
  
  export interface EventPointer {
    id      : string
    relays? : string[]
  }
  
  export interface Nip19Data {
    type : string
    data : string | ProfilePointer | EventPointer
  }
  
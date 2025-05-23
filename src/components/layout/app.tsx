import { useEffect, useState } from 'react'
import { Header }   from './header.js'
import { Tabs }     from './tabs.js'
import { useStore } from '@/store/index.js'
import { RelayPolicy } from '@/types/node.js'
import { decode_group_pkg } from '@frostr/bifrost/encoder'

export function App () {
  const store = useStore()

  useEffect(() => {
    try {
      let { relays, group } = store.data
      // Parse the URL parameters for relay URLs.
      const params = new URLSearchParams(window.location.search)
      // Get the group parameter from the URL.
      const grpstr = params.get('g')
      // Get all the relay URLs from the URL parameters.
      const urls   = params.getAll('r')
      // For each relay URL,
      for (const url of urls) {
        // If the relay URL is not already in the list, add it.
        if (!relays.some(relay => relay.url === url)) {
          relays.push({ url, read: true, write: true })
        }
      }
      if (group === null && grpstr !== null) {
        group = decode_group_pkg(grpstr)
      }
      // Add the relay policies to the store.
      store.update({ group, relays })
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <div className="app">
      <Header />
      <Tabs />
    </div>
  )
}

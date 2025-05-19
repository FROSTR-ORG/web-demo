import { Header }      from './header.js'
import { Dashboard }   from './node/dash.js'
import { Settings }    from './settings/index.js'

export function App () {
  return (
    <div className="app">
      <Header />
      <Dashboard />
      <Settings />
    </div>
  )
}

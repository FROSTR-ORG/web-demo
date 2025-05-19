import { useBifrost } from '@/hooks/useBifrost.js'

export function Dashboard () {
  const node = useBifrost()

  return (
    <div className="node-container">
      <h2 className="section-header">Bifrost Node</h2>
      <p className="description">Bifrost Node Service</p>
      <p>Status {node.status}</p>
    </div>
  )
}

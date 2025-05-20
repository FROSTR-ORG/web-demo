import { useNode } from '@/context/node.js'

export function NodeInfo () {
  const node = useNode()

  return (
    <div className="dashboard-container">
      <h2 className="section-header">Node Status</h2>
      <pre>pubkey: {node.ref.current?.pubkey || 'unknown'}</pre>
      <pre>status: {node.status}</pre>
      <button className="button" onClick={() => node.reset()}>Reset Node</button>
    </div>
  )
}

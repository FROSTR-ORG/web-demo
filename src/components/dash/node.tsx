import { useNode } from '@/context/node.js'
import { NodeAPI } from '@/types'

export function NodeInfo () {
  const node = useNode()

  return (
    <div className="dashboard-container">
      <h2 className="section-header">Node Status</h2>
      <pre>pubkey: {node.ref.current?.pubkey || 'unknown'}</pre>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span>status:</span>
        <span className={`status-indicator ${node.status}`}>{node.status}</span>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button className="button" onClick={() => send_echo(node)}>Send Echo</button>
        <button className="button" onClick={() => node.reset()}>Reset Node</button>
      </div>
    </div>
  )
}

function send_echo (node : NodeAPI) {
  node.ref.current?.req.echo('echo')
}

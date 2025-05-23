import { useNode } from '@/context/node.js'
import { NodeAPI } from '@/types'

export function NodeInfo () {
  const node = useNode()

  return (
    <div className="dashboard-container">
      <h2 className="section-header">Node Status</h2>
      <pre>pubkey: {node.ref.current?.pubkey || 'unknown'}</pre>
      <pre>status: {node.status}</pre>
      <button className="button" onClick={() => send_echo(node)}>Send Echo</button>
      <button className="button" onClick={() => node.reset()}>Reset Node</button>
    </div>
  )
}

function send_echo (node : NodeAPI) {
  node.ref.current?.req.echo('echo')
}

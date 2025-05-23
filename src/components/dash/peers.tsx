import { useNode }       from '@/context/node.js'
import { usePeerStatus } from '@/hooks/usePeerStatus.js'

export function PeerInfo() {
  const node = useNode()
  const { status, fetch_status } = usePeerStatus()

  return (
    <div className="dashboard-container">
      <h2 className="section-header">Peer Status</h2>
      {status.length === 0 ? (
        <p>waiting for peers...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Pubkey</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {status.map((peer) => (
              <tr key={peer.pubkey}>
                <td className="pubkey-cell">{peer.pubkey}</td>
                <td>
                  <span className={`status-indicator ${peer.status}`}>
                    {peer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button 
        className="button" 
        onClick={fetch_status}
        disabled={node.status !== 'online'}
      >
        Refresh
      </button>
    </div>
  )
}

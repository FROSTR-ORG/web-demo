import { useNode }       from '@/context/node.js'
import { usePeerStatus } from '@/hooks/usePeerStatus.js'
import { RefreshIcon }   from '@/components/util/icons.js'

export function PeerInfo() {
  const node = useNode()
  const { status, ping_peer } = usePeerStatus()

  return (
    <div className="dashboard-container">
      <h2 className="section-header">Peer Status</h2>
      {status.length === 0 ? (
        <p>waiting for peers...</p>
      ) : (
        <table className="peers-table">
          <thead>
            <tr>
              <th>Pubkey</th>
              <th>Status</th>
              <th>Refresh</th>
            </tr>
          </thead>
          <tbody>
            {status.map((peer) => (
              <tr key={peer.pubkey}>
                <td className="pubkey-cell">{peer.pubkey}</td>
                <td className="status-cell">
                  <span className={`status-indicator ${peer.status}`}>
                    {peer.status}
                  </span>
                </td>
                <td className="refresh-cell">
                  <button 
                    className="button" 
                    onClick={() => ping_peer(peer.pubkey)}
                    disabled={node.status !== 'online'}
                    title="Refresh peer status"
                  >
                    <RefreshIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

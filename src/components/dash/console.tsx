import { useStore } from '@/store/index.js'

export function Console () {
  
  const store = useStore()
  
  // Clear logs handler
  const clear_logs = async () => {
    store.update({ logs: [] })
  }

  return (
    <div className="console-container">
      <h2 className="section-header">Event Console</h2>
      <p className="description">Monitor events from your bifrost node.</p>
      
      <div className="console-output">
        {store.data.logs.length === 0 ? (
          <div className="console-empty">No events logged yet</div>
        ) : (
          store.data.logs.map((log, idx) => (
            <div key={idx} className={`console-entry`}>
              <span className="console-timestamp">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={`console-message console-${log.type}`}>{log.message}</span>
            </div>
          ))
        )}
      </div>

      <div className="console-controls">
        <button className="button" onClick={clear_logs}>Clear Console</button>
      </div>
    </div>
  )
}

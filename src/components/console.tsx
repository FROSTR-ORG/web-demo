// import { LogStore }     from '../stores/logs.js'

import {
  useEffect,
  useState,
  useRef
} from 'react'

import type { LogEntry } from '../types/console.js'

import '../styles/console.css'

export default function Console() {
  // State for logs
  const [ logs, setLogs ] = useState<LogEntry[]>([])
  
  // Create a ref for the console output element
  const consoleOutputRef = useRef<HTMLDivElement>(null)

  // Load logs on mount and set up subscription.
  useEffect(() => {
    // TODO: Update for PWA
    // LogStore.fetch().then(logs => setLogs(logs))
    // const unsub = LogStore.subscribe(logs => setLogs(logs))
    // return () => unsub()
  }, [])

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    if (consoleOutputRef.current) {
      const element     = consoleOutputRef.current
      element.scrollTop = element.scrollHeight
    }
  }, [ logs ])

  // Clear logs handler
  const clear_handler = async () => {
    // TODO: Update for PWA
    // LogStore.clear().then(() => setLogs([]))
  }

  // Reset node handler
  const reset_handler = async () => {
    try {
        // TODO: Update for PWA
      // Still send message to reset the node
    //   await browser.runtime.sendMessage({ type: MESSAGE_TYPE.NODE_RESET })
    } catch (error) {
      console.error('error resetting node:', error)
    }
  }

  return (
    <div className="console-container">
      <h2 className="section-header">Event Console</h2>
      <p className="description">Monitor events from your bifrost node.</p>
      
      <div 
        className="console-output" 
        ref={consoleOutputRef}
      >
        {logs.length === 0 ? (
          <div className="console-empty">No events logged yet</div>
        ) : (
          logs.map((log, idx) => (
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
        <button className="button" onClick={clear_handler}>Clear Console</button>
        <button className="button button-danger" onClick={reset_handler}>Reset Node</button>
      </div>
    </div>
  );
}

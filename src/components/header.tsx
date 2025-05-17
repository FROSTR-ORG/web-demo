export default function Header () {
  return (
    <div className="page-header">
      <img
        src="assets/frostr-icon.png" 
        alt="Frost Logo" 
        className="frost-logo"
      />
      <div className="title-container">
        <h1>FROSTR Web Demo</h1>
      </div>
      <p>FROSTR Web Demo</p>
      <a 
        href="https://frostr.org" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        https://frostr.org
      </a>
      <div className="alpha-pill alpha-pill-standalone">alpha edition</div>
    </div>
  )
}
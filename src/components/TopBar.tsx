import './TopBar.css'

interface TopBarProps {
  isDetectionActive: boolean
  onToggleDetection: () => void
  onToggleBrowser?: () => void
  showBrowser?: boolean
}

function TopBar({ isDetectionActive, onToggleDetection, onToggleBrowser, showBrowser }: TopBarProps) {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">DuoDex</span>
        </div>
      </div>

      <div className="top-bar-center">
        <div className="status-indicator">
          <span className="status-label">Screen Detection:</span>
          <span className={`status-badge ${isDetectionActive ? 'active' : 'paused'}`}>
            {isDetectionActive ? 'Active 🟢' : 'Paused 🔴'}
          </span>
          <button
            className="toggle-button"
            onClick={onToggleDetection}
            title={isDetectionActive ? 'Pause Detection' : 'Resume Detection'}
          >
            {isDetectionActive ? '⏸ Pause' : '▶ Resume'}
          </button>
          {onToggleBrowser && (
            <button
              className="toggle-button"
              onClick={onToggleBrowser}
              title={showBrowser ? 'Close Browser' : 'Browse Problems'}
              style={{ marginLeft: '8px' }}
            >
              {showBrowser ? '✕ Close' : '📚 Browse'}
            </button>
          )}
        </div>
      </div>

      <div className="top-bar-right">
        <div className="profile-icon" title="User Profile">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>
    </header>
  )
}

export default TopBar

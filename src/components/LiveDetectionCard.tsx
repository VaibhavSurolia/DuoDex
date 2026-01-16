import { ProblemState, DetectedProblem } from '../App'
import './LiveDetectionCard.css'

interface LiveDetectionCardProps {
  problem: DetectedProblem
  isDetectionActive: boolean
  onMarkSolved: () => void
  onMarkStuck: () => void
  onReset: () => void
  problemState: ProblemState
}

function LiveDetectionCard({
  problem,
  isDetectionActive,
  onMarkSolved,
  onMarkStuck,
  onReset,
  problemState
}: LiveDetectionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'var(--difficulty-easy)'
      case 'Medium':
        return 'var(--difficulty-medium)'
      case 'Hard':
        return 'var(--difficulty-hard)'
      default:
        return 'var(--text-secondary)'
    }
  }

  const getPlatformIcon = (platform: string) => {
    return platform === 'LeetCode' ? '📘' : '🔴'
  }

  if (problemState === 'solved' || problemState === 'stuck') {
    return null
  }

  return (
    <div className={`detection-card ${isDetectionActive ? 'pulse-animation' : ''} fade-in`}>
      <div className="detection-card-header">
        <h2 className="detection-card-title">Currently Detected Problem</h2>
        <button className="reset-button" onClick={onReset} title="Reset">
          ↻
        </button>
      </div>
      
      <div className="detection-card-content">
        <div className="platform-badge">
          <span className="platform-icon">{getPlatformIcon(problem.platform)}</span>
          <span className="platform-name">{problem.platform}</span>
        </div>
        
        <h3 className="problem-title">{problem.title}</h3>
        
        <div className="problem-meta">
          <span 
            className="difficulty-label"
            style={{ color: getDifficultyColor(problem.difficulty) }}
          >
            {problem.difficulty}
          </span>
          
          <div className="tags">
            {problem.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="detection-source">
          <span className="detection-source-text">Detected from active screen</span>
        </div>
      </div>
      
      <div className="action-buttons">
        <button 
          className="action-button primary"
          onClick={onMarkSolved}
        >
          <span>Mark as Solved</span>
          <span className="button-icon">✅</span>
        </button>
        
        <button 
          className="action-button secondary"
          onClick={onMarkStuck}
        >
          <span>I'm Stuck</span>
          <span className="button-icon">❌</span>
        </button>
      </div>
    </div>
  )
}

export default LiveDetectionCard

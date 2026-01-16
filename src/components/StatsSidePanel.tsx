import './StatsSidePanel.css'

function StatsSidePanel() {
  const stats = {
    detectedToday: 12,
    solved: 8,
    stuck: 4,
    weakTopics: ['Graphs', 'Dynamic Programming'],
    currentDifficulty: 'Medium'
  }

  const solvedRatio = stats.solved / stats.detectedToday
  const stuckRatio = stats.stuck / stats.detectedToday

  return (
    <aside className="stats-panel">
      <div className="stats-header">
        <h3 className="stats-title">Real-Time Stats</h3>
      </div>
      
      <div className="stats-content">
        <div className="stat-card">
          <div className="stat-label">Problems Detected Today</div>
          <div className="stat-value primary">{stats.detectedToday}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Solved</div>
          <div className="stat-value success">{stats.solved}</div>
          <div className="stat-progress">
            <div 
              className="stat-progress-fill success-fill"
              style={{ width: `${solvedRatio * 100}%` }}
            />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Stuck</div>
          <div className="stat-value warning">{stats.stuck}</div>
          <div className="stat-progress">
            <div 
              className="stat-progress-fill warning-fill"
              style={{ width: `${stuckRatio * 100}%` }}
            />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Weak Topics</div>
          <div className="weak-topics">
            {stats.weakTopics.map((topic, index) => (
              <span key={index} className="weak-topic-tag">
                {topic}
              </span>
            ))}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Current Difficulty Progression</div>
          <div className="difficulty-progression">
            <div className="difficulty-levels">
              <div className={`difficulty-level ${stats.currentDifficulty === 'Easy' ? 'active' : 'completed'}`}>
                Easy
              </div>
              <div className={`difficulty-level ${stats.currentDifficulty === 'Medium' ? 'active' : stats.currentDifficulty === 'Hard' ? 'completed' : ''}`}>
                Medium
              </div>
              <div className={`difficulty-level ${stats.currentDifficulty === 'Hard' ? 'active' : ''}`}>
                Hard
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default StatsSidePanel

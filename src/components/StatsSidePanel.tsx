import { Problem } from '../types'
import { calculateStats } from '../utils/problemUtils'
import './StatsSidePanel.css'

interface StatsSidePanelProps {
  allProblems: Problem[]
}

function StatsSidePanel({ allProblems }: StatsSidePanelProps) {
  if (allProblems.length === 0) {
    return (
      <aside className="stats-panel">
        <div className="stats-header">
          <h3 className="stats-title">Dataset Stats</h3>
        </div>
        <div className="stats-content">
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading statistics...
          </p>
        </div>
      </aside>
    )
  }

  const stats = calculateStats(allProblems)

  return (
    <aside className="stats-panel">
      <div className="stats-header">
        <h3 className="stats-title">Dataset Stats</h3>
      </div>

      <div className="stats-content">
        <div className="stat-card">
          <div className="stat-label">Total Problems</div>
          <div className="stat-value primary">{stats.total}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">By Difficulty</div>
          <div className="difficulty-breakdown">
            <div className="difficulty-item">
              <span className="difficulty-name easy">Easy</span>
              <span className="difficulty-count">{stats.byDifficulty.Easy}</span>
            </div>
            <div className="difficulty-item">
              <span className="difficulty-name medium">Medium</span>
              <span className="difficulty-count">{stats.byDifficulty.Medium}</span>
            </div>
            <div className="difficulty-item">
              <span className="difficulty-name hard">Hard</span>
              <span className="difficulty-count">{stats.byDifficulty.Hard}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Avg. Acceptance Rate</div>
          <div className="stat-value success">{stats.averageAcceptanceRate.toFixed(1)}%</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Top Topics</div>
          <div className="topic-list">
            {stats.topTopics.slice(0, 5).map((topic, index) => (
              <div key={index} className="topic-item">
                <span className="topic-name">{topic.topic}</span>
                <span className="topic-count">{topic.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Avg. Like Ratio</div>
          <div className="stat-value primary">{(stats.averageLikeRatio * 100).toFixed(1)}%</div>
        </div>
      </div>
    </aside>
  )
}

export default StatsSidePanel

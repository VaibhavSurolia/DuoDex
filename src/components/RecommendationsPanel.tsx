import { Problem } from '../types'
import { findSimilarProblems, findNextHarderProblems } from '../utils/problemUtils'
import { getLeetCodeUrl } from '../utils/dataLoader'
import './RecommendationsPanel.css'

interface RecommendationsPanelProps {
  currentProblem: Problem
  allProblems: Problem[]
  onSelectProblem: (problem: Problem) => void
}

function RecommendationsPanel({ currentProblem, allProblems, onSelectProblem }: RecommendationsPanelProps) {
  // Get similar problems and next harder problems
  const similarProblems = findSimilarProblems(currentProblem, allProblems, 3)
  const harderProblems = findNextHarderProblems(currentProblem, allProblems, 3)

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

  const renderProblemCard = (problem: Problem, index: number, type: 'similar' | 'harder') => (
    <div key={problem.id} className="recommendation-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="recommendation-header">
        <div className="recommendation-platform">
          <span className="platform-icon">📘</span>
          <span>LeetCode #{problem.id}</span>
        </div>
        <span
          className="recommendation-difficulty"
          style={{ color: getDifficultyColor(problem.difficulty) }}
        >
          {problem.difficulty}
        </span>
      </div>

      <h3 className="recommendation-title">{problem.name}</h3>

      <div className="recommendation-meta">
        <span title="Acceptance Rate">✓ {problem.acceptanceRate.toFixed(1)}%</span>
        <span title="Likes">👍 {problem.likes.toLocaleString()}</span>
        <span title="Like Ratio">❤️ {(problem.likeRatio * 100).toFixed(1)}%</span>
      </div>

      <div className="recommendation-tags">
        {problem.topics.slice(0, 3).map((tag, tagIndex) => (
          <span key={tagIndex} className="recommendation-tag">
            {tag}
          </span>
        ))}
        {problem.topics.length > 3 && (
          <span className="recommendation-tag">+{problem.topics.length - 3}</span>
        )}
      </div>

      <div className="recommendation-similarity">
        {type === 'similar' ? '🎯 Similar topics' : '⬆️ Next level'}
      </div>

      <div className="recommendation-actions">
        <button
          className="open-problem-button"
          onClick={() => onSelectProblem(problem)}
        >
          Practice This →
        </button>
        {problem.isFree && (
          <a
            href={getLeetCodeUrl(problem.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="leetcode-link-small"
            title="Open on LeetCode"
          >
            🔗
          </a>
        )}
      </div>
    </div>
  )

  return (
    <div className="recommendations-panel slide-in">
      <div className="recommendations-header">
        <h2 className="recommendations-title">Recommended Next Problems</h2>
        <div className="recommendations-subtitle">
          Based on your solved problem: <strong>{currentProblem.name}</strong>
        </div>
      </div>

      {harderProblems.length > 0 && (
        <div className="recommendations-section">
          <h3 className="section-title">📈 Challenge Yourself</h3>
          <div className="recommendations-list">
            {harderProblems.map((problem, index) => renderProblemCard(problem, index, 'harder'))}
          </div>
        </div>
      )}

      {similarProblems.length > 0 && (
        <div className="recommendations-section">
          <h3 className="section-title">🔄 Practice Similar</h3>
          <div className="recommendations-list">
            {similarProblems.map((problem, index) => renderProblemCard(problem, index, 'similar'))}
          </div>
        </div>
      )}

      {harderProblems.length === 0 && similarProblems.length === 0 && (
        <div className="no-recommendations">
          No recommendations available for this problem.
        </div>
      )}
    </div>
  )
}

export default RecommendationsPanel

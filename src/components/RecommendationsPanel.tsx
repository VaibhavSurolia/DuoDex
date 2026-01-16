import { DetectedProblem } from '../App'
import './RecommendationsPanel.css'

interface RecommendationsPanelProps {
  currentProblem: DetectedProblem
}

interface RecommendedProblem {
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  platform: 'LeetCode' | 'Codeforces'
  similarity: string
}

function RecommendationsPanel({ currentProblem }: RecommendationsPanelProps) {
  // Mock recommendations data - in a real app, this would come from a dataset
  const recommendations: RecommendedProblem[] = [
    {
      title: 'Three Sum',
      difficulty: 'Medium',
      tags: ['Array', 'Hash Table', 'Two Pointers'],
      platform: 'LeetCode',
      similarity: 'Similar problem structure'
    },
    {
      title: 'Four Sum',
      difficulty: 'Medium',
      tags: ['Array', 'Hash Table', 'Two Pointers'],
      platform: 'LeetCode',
      similarity: 'Next progression'
    },
    {
      title: 'Subarray Sum Equals K',
      difficulty: 'Medium',
      tags: ['Array', 'Hash Table'],
      platform: 'LeetCode',
      similarity: 'Related concept'
    },
    {
      title: 'Two Sum IV - Input is a BST',
      difficulty: 'Easy',
      tags: ['Tree', 'Hash Table'],
      platform: 'LeetCode',
      similarity: 'Variation with tree structure'
    }
  ]

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

  return (
    <div className="recommendations-panel slide-in">
      <div className="recommendations-header">
        <h2 className="recommendations-title">Recommended Next Problems</h2>
        <div className="recommendations-subtitle">
          Based on your solved problem: <strong>{currentProblem.title}</strong>
        </div>
      </div>
      
      <div className="recommendations-list">
        {recommendations.map((problem, index) => (
          <div key={index} className="recommendation-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="recommendation-header">
              <div className="recommendation-platform">
                <span className="platform-icon">{getPlatformIcon(problem.platform)}</span>
                <span>{problem.platform}</span>
              </div>
              <span 
                className="recommendation-difficulty"
                style={{ color: getDifficultyColor(problem.difficulty) }}
              >
                {problem.difficulty}
              </span>
            </div>
            
            <h3 className="recommendation-title">{problem.title}</h3>
            
            <div className="recommendation-tags">
              {problem.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="recommendation-tag">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="recommendation-similarity">
              {problem.similarity}
            </div>
            
            <button className="open-problem-button">
              Open Problem →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecommendationsPanel

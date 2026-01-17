import { useState } from 'react'
import { Problem } from '../types'
import './GuidedHintSystem.css'

interface GuidedHintSystemProps {
  problem: Problem
}

const hints = [
  'Consider using a hash table to store elements you have already seen.',
  'Think about the relationship between the target value and the elements in the array.',
  'A single pass through the array might be sufficient with the right data structure.',
  'Remember: for each element, you need to find if its complement (target - element) exists in the array.'
]

function GuidedHintSystem({ problem }: GuidedHintSystemProps) {
  const [revealedHints, setRevealedHints] = useState<number[]>([])
  const [showSolutionRequest, setShowSolutionRequest] = useState(false)

  const revealNextHint = () => {
    if (revealedHints.length < hints.length) {
      setRevealedHints([...revealedHints, revealedHints.length])
    }

    if (revealedHints.length === hints.length - 1) {
      setShowSolutionRequest(true)
    }
  }

  const isHintRevealed = (index: number) => {
    return revealedHints.includes(index)
  }

  return (
    <div className="hint-system slide-in">
      <div className="hint-system-header">
        <h2 className="hint-system-title">Guided Hint System</h2>
        <div className="hint-system-subtitle">
          Problem: <strong>{problem.name}</strong>
        </div>
      </div>

      <div className="hint-warning">
        <span className="warning-icon">⚠️</span>
        <span className="warning-text">
          Hints are designed to guide, not give away the solution.
        </span>
      </div>

      <div className="hint-progress">
        <span className="progress-text">
          Hint {Math.min(revealedHints.length + 1, hints.length)} of {hints.length}
        </span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(revealedHints.length / hints.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="hints-container">
        {hints.map((hint, index) => (
          <div
            key={index}
            className={`hint-card ${isHintRevealed(index) ? 'revealed' : 'locked'}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="hint-number">
              {index + 1}
            </div>
            {isHintRevealed(index) ? (
              <div className="hint-content fade-in">
                {hint}
              </div>
            ) : (
              <div className="hint-locked">
                <span className="lock-icon">🔒</span>
                <span className="locked-text">Hint locked</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {revealedHints.length < hints.length && (
        <button className="reveal-hint-button" onClick={revealNextHint}>
          Reveal Next Hint →
        </button>
      )}

      {showSolutionRequest && (
        <div className="solution-request fade-in">
          <div className="solution-request-warning">
            <span className="warning-icon">💡</span>
            <span>You've viewed all hints. Still need help?</span>
          </div>
          <button className="request-solution-button">
            Request Full Solution
          </button>
        </div>
      )}
    </div>
  )
}

export default GuidedHintSystem

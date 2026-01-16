import { useState } from 'react'
import TopBar from './components/TopBar'
import LiveDetectionCard from './components/LiveDetectionCard'
import RecommendationsPanel from './components/RecommendationsPanel'
import GuidedHintSystem from './components/GuidedHintSystem'
import StatsSidePanel from './components/StatsSidePanel'
import './App.css'

export type ProblemState = 'detected' | 'solved' | 'stuck' | 'none'
export type Platform = 'LeetCode' | 'Codeforces'

export interface DetectedProblem {
  platform: Platform
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
}

function App() {
  const [isDetectionActive, setIsDetectionActive] = useState(true)
  const [problemState, setProblemState] = useState<ProblemState>('detected')
  const [detectedProblem, setDetectedProblem] = useState<DetectedProblem>({
    platform: 'LeetCode',
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table']
  })

  const handleMarkSolved = () => {
    setProblemState('solved')
  }

  const handleMarkStuck = () => {
    setProblemState('stuck')
  }

  const handleReset = () => {
    setProblemState('detected')
  }

  return (
    <div className="app">
      <TopBar
        isDetectionActive={isDetectionActive}
        onToggleDetection={() => setIsDetectionActive(!isDetectionActive)}
      />
      <div className="app-content">
        <div className="main-dashboard">
          <LiveDetectionCard
            problem={detectedProblem}
            isDetectionActive={isDetectionActive}
            onMarkSolved={handleMarkSolved}
            onMarkStuck={handleMarkStuck}
            onReset={handleReset}
            problemState={problemState}
          />
          
          {problemState === 'solved' && (
            <RecommendationsPanel currentProblem={detectedProblem} />
          )}
          
          {problemState === 'stuck' && (
            <GuidedHintSystem problem={detectedProblem} />
          )}
        </div>
        
        <StatsSidePanel />
      </div>
    </div>
  )
}

export default App

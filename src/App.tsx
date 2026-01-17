import { useState, useEffect } from 'react'
import TopBar from './components/TopBar'
import LiveDetectionCard from './components/LiveDetectionCard'
import RecommendationsPanel from './components/RecommendationsPanel'
import GuidedHintSystem from './components/GuidedHintSystem'
import StatsSidePanel from './components/StatsSidePanel'
import ProblemBrowser from './components/ProblemBrowser'
import ProblemWorkspace from './components/ProblemWorkspace'
import { Problem, ProblemState } from './types'
import { loadProblems } from './utils/dataLoader'
import './App.css'

function App() {
  const [isDetectionActive, setIsDetectionActive] = useState(true)
  const [problemState, setProblemState] = useState<ProblemState>('none')
  const [allProblems, setAllProblems] = useState<Problem[]>([])
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showBrowser, setShowBrowser] = useState(false)
  const [showWorkspace, setShowWorkspace] = useState(false)

  // Load problems on mount
  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true)
      const problems = await loadProblems()
      setAllProblems(problems)

      // Set first problem as default (Two Sum)
      if (problems.length > 0) {
        setCurrentProblem(problems[0])
        setProblemState('detected')
      }

      setIsLoading(false)
    }

    fetchProblems()
  }, [])

  const handleMarkSolved = () => {
    setProblemState('solved')
  }

  const handleMarkStuck = () => {
    setProblemState('stuck')
  }

  const handleReset = () => {
    setProblemState('detected')
  }

  const handleSelectProblem = (problem: Problem) => {
    setCurrentProblem(problem)
    setProblemState('detected')
    setShowBrowser(false)
    setShowWorkspace(true) // Open workspace for coding
  }

  const handleCloseWorkspace = () => {
    setShowWorkspace(false)
  }

  const handleToggleBrowser = () => {
    setShowBrowser(!showBrowser)
  }

  if (isLoading) {
    return (
      <div className="app">
        <TopBar
          isDetectionActive={isDetectionActive}
          onToggleDetection={() => setIsDetectionActive(!isDetectionActive)}
        />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading LeetCode problems...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {/* Problem Workspace - Full screen coding environment */}
      {showWorkspace && currentProblem && (
        <ProblemWorkspace
          problem={currentProblem}
          onClose={handleCloseWorkspace}
        />
      )}

      {!showWorkspace && (
        <>
          <TopBar
            isDetectionActive={isDetectionActive}
            onToggleDetection={() => setIsDetectionActive(!isDetectionActive)}
            onToggleBrowser={handleToggleBrowser}
            showBrowser={showBrowser}
          />
          <div className="app-content">
            {showBrowser ? (
              <ProblemBrowser
                problems={allProblems}
                onSelectProblem={handleSelectProblem}
              />
            ) : (
              <>
                <div className="main-dashboard">
                  {currentProblem && (
                    <LiveDetectionCard
                      problem={currentProblem}
                      isDetectionActive={isDetectionActive}
                      onMarkSolved={handleMarkSolved}
                      onMarkStuck={handleMarkStuck}
                      onReset={handleReset}
                      problemState={problemState}
                    />
                  )}

                  {problemState === 'solved' && currentProblem && (
                    <RecommendationsPanel
                      currentProblem={currentProblem}
                      allProblems={allProblems}
                      onSelectProblem={handleSelectProblem}
                    />
                  )}

                  {problemState === 'stuck' && currentProblem && (
                    <GuidedHintSystem problem={currentProblem} />
                  )}
                </div>

                <StatsSidePanel allProblems={allProblems} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default App

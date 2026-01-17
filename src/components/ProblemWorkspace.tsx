import { useState, useEffect } from 'react'
import { Problem } from '../types'
import CodeEditor from './CodeEditor'
import CaptureIndicator from './CaptureIndicator'
import AIHintDisplay from './AIHintDisplay'
import { screenCapture } from '../utils/screenCapture'
import { generateHint, HintResponse } from '../services/geminiService'
import './ProblemWorkspace.css'

interface ProblemWorkspaceProps {
    problem: Problem
    onClose: () => void
}

function ProblemWorkspace({ problem, onClose }: ProblemWorkspaceProps) {
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState('javascript')
    const [output, setOutput] = useState('')
    const [isRunning, setIsRunning] = useState(false)
    const [isCapturing, setIsCapturing] = useState(false)
    const [aiHints, setAiHints] = useState<HintResponse | null>(null)
    const [isGeneratingHints, setIsGeneratingHints] = useState(false)

    useEffect(() => {
        // Component mounted - could start capture automatically
        return () => {
            // Cleanup on unmount
            screenCapture.stopAutoCapture()
        }
    }, [])

    const handleCodeChange = (newCode: string) => {
        setCode(newCode)
    }

    const handleRunCode = async (userCode: string, lang: string) => {
        setIsRunning(true)
        setOutput('Running code...\n')
        setLanguage(lang)

        // Capture screenshot when code is run
        if (isCapturing) {
            await screenCapture.captureNow('problem-workspace-container', 'Code execution attempt')
        }

        try {
            if (lang === 'javascript') {
                const capturedLogs: string[] = []
                const originalLog = console.log
                console.log = (...args) => {
                    capturedLogs.push(args.map(arg => String(arg)).join(' '))
                }

                try {
                    eval(userCode)
                    setOutput(capturedLogs.join('\n') || 'Code executed successfully (no output)')
                } catch (error: any) {
                    setOutput(`Error: ${error.message}`)
                } finally {
                    console.log = originalLog
                }
            } else {
                setOutput(`⚠️ ${lang} execution not yet implemented.\nPlease use JavaScript for now, or integrate a backend API for other languages.`)
            }
        } finally {
            setIsRunning(false)
        }
    }

    const handleSubmit = async (userCode: string, lang: string) => {
        setLanguage(lang)

        // Final capture on submit
        if (isCapturing) {
            await screenCapture.captureNow('problem-workspace-container', 'Solution submission')
        }

        // Generate AI hints
        setIsGeneratingHints(true)
        try {
            const captures = screenCapture.getRecentCaptures(5)
            const hints = await generateHint({
                problem,
                userCode,
                language: lang,
                codeOutput: output,
                captureData: captures.map(c => c.imageData)
            })

            setAiHints(hints)
        } catch (error) {
            console.error('Failed to generate hints:', error)
            setAiHints({
                hints: [],
                encouragement: '',
                nextSteps: [],
                error: 'Failed to connect to AI service. Please try again.'
            })
        } finally {
            setIsGeneratingHints(false)
        }
    }

    const handleToggleCapture = () => {
        if (isCapturing) {
            screenCapture.stopAutoCapture()
            setIsCapturing(false)
        } else {
            screenCapture.startAutoCapture('problem-workspace-container', 120000) // 2 min intervals
            setIsCapturing(true)
        }
    }

    const handleCloseHints = () => {
        setAiHints(null)
    }

    return (
        <div className="problem-workspace" id="problem-workspace-container">
            <div className="workspace-header">
                <div className="workspace-title">
                    <h2>{problem.name}</h2>
                    <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                        {problem.difficulty}
                    </span>
                </div>
                <button className="close-workspace-button" onClick={onClose} title="Close">
                    ✕
                </button>
            </div>

            <div className="workspace-content">
                {/* Left Panel - Problem Description */}
                <div className="problem-panel">
                    <div className="problem-section">
                        <h3>Description</h3>
                        <div className="problem-description">
                            <p>
                                <strong>Problem #{problem.id}</strong>
                            </p>
                            <p>
                                Given an array of integers <code>nums</code> and an integer <code>target</code>,
                                return <em>indices of the two numbers such that they add up to <code>target</code></em>.
                            </p>
                            <p>
                                You may assume that each input would have <strong className="important">exactly one solution</strong>,
                                and you may not use the same element twice.
                            </p>
                            <p>
                                You can return the answer in any order.
                            </p>
                        </div>
                    </div>

                    <div className="problem-section">
                        <h3>Examples</h3>
                        <div className="example">
                            <strong>Example 1:</strong>
                            <pre>
                                {`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}
                            </pre>
                        </div>
                        <div className="example">
                            <strong>Example 2:</strong>
                            <pre>
                                {`Input: nums = [3,2,4], target = 6
Output: [1,2]`}
                            </pre>
                        </div>
                        <div className="example">
                            <strong>Example 3:</strong>
                            <pre>
                                {`Input: nums = [3,3], target = 6
Output: [0,1]`}
                            </pre>
                        </div>
                    </div>

                    <div className="problem-section">
                        <h3>Constraints</h3>
                        <ul>
                            <li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
                            <li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
                            <li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
                            <li>Only one valid answer exists.</li>
                        </ul>
                    </div>

                    <div className="problem-section">
                        <h3>Topics</h3>
                        <div className="problem-topics">
                            {problem.topics.map((topic, index) => (
                                <span key={index} className="topic-tag">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="problem-stats-section">
                        <div className="stat-item">
                            <span className="stat-label">Acceptance:</span>
                            <span className="stat-value">{problem.acceptanceRate.toFixed(1)}%</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Likes:</span>
                            <span className="stat-value">👍 {problem.likes.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Code Editor */}
                <div className="editor-panel">
                    <CodeEditor
                        problemId={problem.id}
                        onCodeChange={handleCodeChange}
                        onRunCode={handleRunCode}
                        onSubmitCode={handleSubmit}
                    />

                    {/* Console Output */}
                    <div className="console-panel">
                        <div className="console-header">
                            <h4>Console Output</h4>
                        </div>
                        <div className="console-content">
                            <pre>{output || 'Run your code to see output here...'}</pre>
                        </div>
                    </div>
                </div>
            </div>

            {/* Screen Capture Indicator */}
            <CaptureIndicator
                isActive={isCapturing}
                onToggle={handleToggleCapture}
            />

            {/* AI Hints Modal */}
            {(aiHints || isGeneratingHints) && (
                <AIHintDisplay
                    hints={aiHints || { hints: [], encouragement: '', nextSteps: [] }}
                    onClose={handleCloseHints}
                    isLoading={isGeneratingHints}
                />
            )}
        </div>
    )
}

export default ProblemWorkspace

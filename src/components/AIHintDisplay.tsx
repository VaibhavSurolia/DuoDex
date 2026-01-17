import { HintResponse } from '../services/geminiService'
import './AIHintDisplay.css'

interface AIHintDisplayProps {
    hints: HintResponse
    onClose: () => void
    isLoading?: boolean
}

function AIHintDisplay({ hints, onClose, isLoading }: AIHintDisplayProps) {
    if (isLoading) {
        return (
            <div className="ai-hint-overlay">
                <div className="ai-hint-panel loading">
                    <div className="hint-header">
                        <h3>🤖 Generating AI Hints...</h3>
                    </div>
                    <div className="loading-spinner-container">
                        <div className="ai-loading-spinner"></div>
                        <p>Analyzing your code with Google Gemini AI...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (hints.error) {
        return (
            <div className="ai-hint-overlay">
                <div className="ai-hint-panel error">
                    <div className="hint-header">
                        <h3>⚠️ Error</h3>
                        <button className="close-hint-button" onClick={onClose}>✕</button>
                    </div>
                    <div className="error-message">
                        <p>{hints.error}</p>
                        <p className="error-help">
                            {hints.error.includes('API key') && (
                                <span>
                                    To use AI hints, add your Google Gemini API key to a <code>.env</code> file:
                                    <br />
                                    <code>VITE_GEMINI_API_KEY=AIzaSyDuz8wVFkeunjnWJf1ldjGsopAcW8QL7-0</code>
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="ai-hint-overlay">
            <div className="ai-hint-panel">
                <div className="hint-header">
                    <h3>🤖 AI-Powered Hints</h3>
                    <button className="close-hint-button" onClick={onClose}>✕</button>
                </div>

                {hints.encouragement && (
                    <div className="encouragement-section">
                        <h4>💪 Encouragement</h4>
                        <p>{hints.encouragement}</p>
                    </div>
                )}

                {hints.hints.length > 0 && (
                    <div className="hints-section">
                        <h4>💡 Hints</h4>
                        <div className="hints-list">
                            {hints.hints.map((hint, index) => (
                                <div key={index} className="hint-item">
                                    <div className="hint-number">{index + 1}</div>
                                    <div className="hint-text">{hint}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {hints.nextSteps.length > 0 && (
                    <div className="next-steps-section">
                        <h4>🎯 Next Steps</h4>
                        <ul className="next-steps-list">
                            {hints.nextSteps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="hint-actions">
                    <button className="hint-action-button" onClick={onClose}>
                        Got it! Let me try again
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AIHintDisplay

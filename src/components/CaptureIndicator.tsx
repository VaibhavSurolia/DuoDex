import { useState, useEffect } from 'react'
import { screenCapture } from '../utils/screenCapture'
import './CaptureIndicator.css'

interface CaptureIndicatorProps {
    isActive: boolean
    onToggle: () => void
}

function CaptureIndicator({ isActive, onToggle }: CaptureIndicatorProps) {
    const [captureCount, setCaptureCount] = useState(0)
    const [showConsent, setShowConsent] = useState(true)

    useEffect(() => {
        // Update capture count every second
        const interval = setInterval(() => {
            setCaptureCount(screenCapture.getCaptureCount())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const handleManualCapture = async () => {
        const success = await screenCapture.captureNow('problem-workspace-container', 'Manual capture')
        if (success) {
            setCaptureCount(screenCapture.getCaptureCount())
        }
    }

    if (showConsent) {
        return (
            <div className="capture-consent">
                <div className="consent-content">
                    <h3>🔒 Privacy Notice</h3>
                    <p>
                        DuoDex can capture screenshots of your coding workspace to provide better AI hints.
                        Screenshots are stored locally and only sent to Google Gemini API when you request hints.
                    </p>
                    <div className="consent-actions">
                        <button
                            className="consent-button accept"
                            onClick={() => {
                                setShowConsent(false)
                                onToggle()
                            }}
                        >
                            Enable Screen Capture
                        </button>
                        <button
                            className="consent-button decline"
                            onClick={() => setShowConsent(false)}
                        >
                            Continue Without Capture
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="capture-indicator">
            <div className="capture-status">
                {isActive && <span className="recording-dot"></span>}
                <span className="status-text">
                    {isActive ? 'Recording' : 'Not Recording'}
                </span>
                <span className="capture-count">{captureCount} captures</span>
            </div>

            <div className="capture-controls">
                <button
                    className={`toggle-button ${isActive ? 'active' : ''}`}
                    onClick={onToggle}
                    title={isActive ? 'Stop auto-capture' : 'Start auto-capture'}
                >
                    {isActive ? '⏸ Pause' : '▶ Start'}
                </button>
                <button
                    className="manual-capture-button"
                    onClick={handleManualCapture}
                    title="Take screenshot now"
                >
                    📸 Capture
                </button>
            </div>
        </div>
    )
}

export default CaptureIndicator

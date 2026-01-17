import html2canvas from 'html2canvas'

export interface CaptureData {
    timestamp: number
    imageData: string // Base64 encoded image
    description: string
}

/**
 * Capture a screenshot of a specific element
 */
export async function captureElement(elementId: string, description: string): Promise<CaptureData | null> {
    const element = document.getElementById(elementId)

    if (!element) {
        console.warn(`Element ${elementId} not found for capture`)
        return null
    }

    try {
        const canvas = await html2canvas(element, {
            backgroundColor: '#0a0a0f',
            scale: 0.5, // Reduce quality to save memory
            logging: false,
        })

        const imageData = canvas.toDataURL('image/jpeg', 0.6) // JPEG with 60% quality

        return {
            timestamp: Date.now(),
            imageData,
            description
        }
    } catch (error) {
        console.error('Failed to capture screenshot:', error)
        return null
    }
}

/**
 * Screen capture manager for tracking coding progress
 */
export class ScreenCaptureManager {
    private captures: CaptureData[] = []
    private maxCaptures = 10 // Limit to prevent memory issues
    private isCapturing = false
    private captureInterval: number | null = null

    /**
     * Start automatic screen capture
     */
    startAutoCapture(elementId: string, intervalMs: number = 120000) { // Every 2 minutes
        if (this.isCapturing) return

        this.isCapturing = true

        // Capture immediately
        this.captureNow(elementId, 'Auto-capture started')

        // Set up interval
        this.captureInterval = window.setInterval(async () => {
            await this.captureNow(elementId, 'Auto-capture')
        }, intervalMs)

        console.log('Auto-capture started')
    }

    /**
     * Stop automatic screen capture
     */
    stopAutoCapture() {
        if (this.captureInterval) {
            clearInterval(this.captureInterval)
            this.captureInterval = null
        }
        this.isCapturing = false
        console.log('Auto-capture stopped')
    }

    /**
     * Manually trigger a capture
     */
    async captureNow(elementId: string, description: string): Promise<boolean> {
        const capture = await captureElement(elementId, description)

        if (capture) {
            this.addCapture(capture)
            return true
        }

        return false
    }

    /**
     * Add a capture to the list
     */
    private addCapture(capture: CaptureData) {
        this.captures.push(capture)

        // Remove oldest captures if we exceed the limit
        if (this.captures.length > this.maxCaptures) {
            this.captures.shift()
        }
    }

    /**
     * Get all captures
     */
    getCaptures(): CaptureData[] {
        return [...this.captures]
    }

    /**
     * Get the most recent N captures
     */
    getRecentCaptures(count: number = 5): CaptureData[] {
        return this.captures.slice(-count)
    }

    /**
     * Clear all captures
     */
    clearCaptures() {
        this.captures = []
    }

    /**
     * Get capture count
     */
    getCaptureCount(): number {
        return this.captures.length
    }
}

// Create a singleton instance
export const screenCapture = new ScreenCaptureManager()

import { GoogleGenerativeAI } from '@google/generative-ai'
import { Problem } from '../types'

// Initialize Gemini API
// NOTE: For production, this API key should be stored in environment variables
// and accessed through a backend API to keep it secure
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDuz8wVFkeunjnWJf1ldjGsopAcW8QL7-0'

let genAI: GoogleGenerativeAI | null = null

try {
    if (API_KEY) {
        genAI = new GoogleGenerativeAI(API_KEY)
    }
} catch (error) {
    console.error('Failed to initialize Gemini AI:', error)
}

export interface HintRequest {
    problem: Problem
    userCode: string
    language: string
    codeOutput?: string
    captureData?: string[] // Base64 screenshots
}

export interface HintResponse {
    hints: string[]
    encouragement: string
    nextSteps: string[]
    error?: string
}

/**
 * Generate AI-powered hints for a coding problem
 */
export async function generateHint(request: HintRequest): Promise<HintResponse> {
    if (!genAI) {
        return {
            hints: [],
            encouragement: '',
            nextSteps: [],
            error: 'Gemini API not configured. Please add your API key to .env file as VITE_GEMINI_API_KEY'
        }
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const prompt = buildPrompt(request)
        const result = await model.generateContent(prompt)
        const response =  result.response
        const text = response.text()

        // Parse the response
        return parseGeminiResponse(text)
    } catch (error: any) {
        console.error('Gemini API Error:', error)
        return {
            hints: [],
            encouragement: '',
            nextSteps: [],
            error: `Failed to generate hints: ${error.message}`
        }
    }
}

/**
 * Build the prompt for Gemini API
 */
function buildPrompt(request: HintRequest): string {
    return `You are a helpful coding mentor assisting a student solve a LeetCode problem.

**Problem Information:**
- Name: ${request.problem.name}
- Difficulty: ${request.problem.difficulty}
- Topics: ${request.problem.topics.join(', ')}
- Acceptance Rate: ${request.problem.acceptanceRate}%

**Problem Description:**
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Student's Code (${request.language}):**
\`\`\`${request.language}
${request.userCode}
\`\`\`

${request.codeOutput ? `**Code Output:**\n${request.codeOutput}\n` : ''}

**Your Task:**
Analyze the student's code and provide educational guidance without giving away the complete solution.

Please respond in this exact format:

HINTS:
1. [First hint about their approach or a small issue]
2. [Second hint about algorithm or data structure]
3. [Third hint about optimization or edge cases]

ENCOURAGEMENT:
[A brief encouraging message about what they're doing right]

NEXT_STEPS:
- [Specific next step they should take]
- [Another actionable suggestion]

Be supportive, educational, and progressive in your hints. Don't give the full solution.`
}

/**
 * Parse Gemini's response into structured format
 */
function parseGeminiResponse(text: string): HintResponse {
    const hints: string[] = []
    let encouragement = ''
    const nextSteps: string[] = []

    try {
        // Extract hints
        const hintsMatch = text.match(/HINTS:\s*\n([\s\S]*?)(?=\n\nENCOURAGEMENT:|$)/i)
        if (hintsMatch) {
            const hintsText = hintsMatch[1]
            const hintLines = hintsText.split('\n').filter(line => line.trim())
            hintLines.forEach(line => {
                const cleaned = line.replace(/^\d+\.\s*/, '').trim()
                if (cleaned) hints.push(cleaned)
            })
        }

        // Extract encouragement
        const encouragementMatch = text.match(/ENCOURAGEMENT:\s*\n([\s\S]*?)(?=\n\nNEXT_STEPS:|$)/i)
        if (encouragementMatch) {
            encouragement = encouragementMatch[1].trim()
        }

        // Extract next steps
        const nextStepsMatch = text.match(/NEXT_STEPS:\s*\n([\s\S]*?)$/i)
        if (nextStepsMatch) {
            const stepsText = nextStepsMatch[1]
            const stepLines = stepsText.split('\n').filter(line => line.trim())
            stepLines.forEach(line => {
                const cleaned = line.replace(/^[-*]\s*/, '').trim()
                if (cleaned) nextSteps.push(cleaned)
            })
        }

        // Fallback if parsing fails
        if (hints.length === 0) {
            hints.push(text.substring(0, 200) + '...')
        }
    } catch (error) {
        console.error('Failed to parse Gemini response:', error)
        hints.push('Review your code logic and consider the problem constraints.')
    }

    return {
        hints: hints.slice(0, 5), // Limit to 5 hints
        encouragement: encouragement || 'Keep going! You\'re on the right track.',
        nextSteps: nextSteps.slice(0, 3) // Limit to 3 next steps
    }
}

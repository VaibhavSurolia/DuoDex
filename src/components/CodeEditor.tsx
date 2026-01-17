import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { getCodeTemplate, supportedLanguages } from '../utils/codeTemplates'
import './CodeEditor.css'

interface CodeEditorProps {
    problemId: number
    onCodeChange?: (code: string) => void
    onRunCode?: (code: string, language: string) => void
    onSubmitCode?: (code: string, language: string) => void
}

function CodeEditor({ problemId, onCodeChange, onRunCode, onSubmitCode }: CodeEditorProps) {
    const [language, setLanguage] = useState('javascript')
    const [code, setCode] = useState(getCodeTemplate(problemId, 'javascript'))
    const [isRunning, setIsRunning] = useState(false)

    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage)
        const template = getCodeTemplate(problemId, newLanguage)
        setCode(template)
        onCodeChange?.(template)
    }

    const handleEditorChange = (value: string | undefined) => {
        const newCode = value || ''
        setCode(newCode)
        onCodeChange?.(newCode)
    }

    const handleRunCode = async () => {
        setIsRunning(true)
        await onRunCode?.(code, language)
        setIsRunning(false)
    }

    const handleSubmit = () => {
        onSubmitCode?.(code, language)
    }

    const handleReset = () => {
        const template = getCodeTemplate(problemId, language)
        setCode(template)
        onCodeChange?.(template)
    }

    return (
        <div className="code-editor-container">
            <div className="editor-toolbar">
                <div className="language-selector">
                    <label htmlFor="language">Language:</label>
                    <select
                        id="language"
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="language-select"
                    >
                        {supportedLanguages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="editor-actions">
                    <button
                        className="editor-button reset-button"
                        onClick={handleReset}
                        title="Reset to template"
                    >
                        ↻ Reset
                    </button>
                    <button
                        className="editor-button run-button"
                        onClick={handleRunCode}
                        disabled={isRunning}
                    >
                        {isRunning ? '⏳ Running...' : '▶ Run Code'}
                    </button>
                    <button
                        className="editor-button submit-button"
                        onClick={handleSubmit}
                    >
                        ✓ Submit
                    </button>
                </div>
            </div>

            <div className="editor-wrapper">
                <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={handleEditorChange}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: true,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                    }}
                />
            </div>
        </div>
    )
}

export default CodeEditor

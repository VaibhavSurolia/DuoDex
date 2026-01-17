import { useState } from 'react'
import { Problem, ProblemFilters, SortOption } from '../types'
import { filterProblems, sortProblems, getAllTopics } from '../utils/problemUtils'
import './ProblemBrowser.css'

interface ProblemBrowserProps {
    problems: Problem[]
    onSelectProblem: (problem: Problem) => void
}

function ProblemBrowser({ problems, onSelectProblem }: ProblemBrowserProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'all'>('all')
    const [selectedTopic, setSelectedTopic] = useState('all')
    const [sortBy, setSortBy] = useState<SortOption>('id')

    // Get all unique topics for filter
    const allTopics = getAllTopics(problems)

    // Apply filters and sorting
    const filters: ProblemFilters = {
        searchQuery,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        topics: selectedTopic !== 'all' ? [selectedTopic] : undefined
    }

    const filteredProblems = sortProblems(
        filterProblems(problems, filters),
        sortBy,
        sortBy === 'id' // ascending for ID
    )

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

    return (
        <div className="problem-browser">
            <div className="browser-header">
                <h2 className="browser-title">Browse Problems ({filteredProblems.length})</h2>
                <p className="browser-subtitle">Select a problem to start practicing</p>
            </div>

            <div className="browser-filters">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by name, ID, or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select
                    className="filter-select"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                >
                    <option value="all">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

                <select
                    className="filter-select"
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                >
                    <option value="all">All Topics</option>
                    {allTopics.slice(0, 20).map((topic) => (
                        <option key={topic} value={topic}>
                            {topic}
                        </option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                    <option value="id">Sort by ID</option>
                    <option value="likes">Sort by Popularity</option>
                    <option value="acceptance">Sort by Acceptance</option>
                    <option value="difficulty">Sort by Difficulty</option>
                </select>
            </div>

            <div className="problems-grid">
                {filteredProblems.map((problem, index) => (
                    <div
                        key={problem.id}
                        className="problem-card fade-in"
                        style={{ animationDelay: `${(index % 20) * 0.05}s` }}
                        onClick={() => onSelectProblem(problem)}
                    >
                        <div className="problem-card-header">
                            <span className="problem-card-id">#{problem.id}</span>
                            <span
                                className="problem-card-difficulty"
                                style={{ color: getDifficultyColor(problem.difficulty) }}
                            >
                                {problem.difficulty}
                            </span>
                        </div>

                        <h3 className="problem-card-title">{problem.name}</h3>

                        <div className="problem-card-stats">
                            <span title="Acceptance Rate">✓ {problem.acceptanceRate.toFixed(1)}%</span>
                            <span title="Likes">👍 {problem.likes.toLocaleString()}</span>
                            {problem.isFree && <span title="Free">🆓</span>}
                            {problem.hasSolution && <span title="Has Solution">📝</span>}
                            {problem.hasVideoSolution && <span title="Video Solution">🎥</span>}
                        </div>

                        <div className="problem-card-tags">
                            {problem.topics.slice(0, 3).map((tag, tagIndex) => (
                                <span key={tagIndex} className="problem-tag">
                                    {tag}
                                </span>
                            ))}
                            {problem.topics.length > 3 && (
                                <span className="problem-tag">+{problem.topics.length - 3}</span>
                            )}
                        </div>

                        <button className="select-problem-button">
                            Practice This Problem →
                        </button>
                    </div>
                ))}
            </div>

            {filteredProblems.length === 0 && (
                <div className="no-results">
                    <p>No problems found matching your filters.</p>
                    <button
                        className="reset-filters-button"
                        onClick={() => {
                            setSearchQuery('')
                            setSelectedDifficulty('all')
                            setSelectedTopic('all')
                        }}
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProblemBrowser

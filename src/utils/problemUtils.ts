import { Problem, ProblemFilters, SortOption, DatasetStats } from '../types';

/**
 * Filter problems based on criteria
 */
export function filterProblems(problems: Problem[], filters: ProblemFilters): Problem[] {
    return problems.filter(problem => {
        // Filter by difficulty
        if (filters.difficulty && problem.difficulty !== filters.difficulty) {
            return false;
        }

        // Filter by topics
        if (filters.topics && filters.topics.length > 0) {
            const hasMatchingTopic = filters.topics.some(topic =>
                problem.topics.some(pt => pt.toLowerCase().includes(topic.toLowerCase()))
            );
            if (!hasMatchingTopic) return false;
        }

        // Filter by acceptance rate range
        if (filters.minAcceptanceRate && problem.acceptanceRate < filters.minAcceptanceRate) {
            return false;
        }
        if (filters.maxAcceptanceRate && problem.acceptanceRate > filters.maxAcceptanceRate) {
            return false;
        }

        // Filter by free status
        if (filters.isFree !== undefined && problem.isFree !== filters.isFree) {
            return false;
        }

        // Search query
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            const nameMatch = problem.name.toLowerCase().includes(query);
            const topicMatch = problem.topics.some(t => t.toLowerCase().includes(query));
            const idMatch = problem.id.toString().includes(query);

            if (!nameMatch && !topicMatch && !idMatch) return false;
        }

        return true;
    });
}

/**
 * Sort problems by specified option
 */
export function sortProblems(problems: Problem[], sortBy: SortOption, ascending = false): Problem[] {
    const sorted = [...problems];

    sorted.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'id':
                comparison = a.id - b.id;
                break;
            case 'likes':
                comparison = a.likes - b.likes;
                break;
            case 'acceptance':
                comparison = a.acceptanceRate - b.acceptanceRate;
                break;
            case 'difficulty':
                const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
                comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
                break;
        }

        return ascending ? comparison : -comparison;
    });

    return sorted;
}

/**
 * Find similar problems based on topics
 */
export function findSimilarProblems(
    problem: Problem,
    allProblems: Problem[],
    limit = 5
): Problem[] {
    return allProblems
        .filter(p => p.id !== problem.id) // Exclude current problem
        .map(p => ({
            problem: p,
            score: calculateSimilarityScore(problem, p)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.problem);
}

/**
 * Calculate similarity score between two problems
 */
function calculateSimilarityScore(p1: Problem, p2: Problem): number {
    let score = 0;

    // Same difficulty = +10 points
    if (p1.difficulty === p2.difficulty) score += 10;

    // One difficulty level apart = +5 points
    const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
    const diffDifference = Math.abs(difficultyOrder[p1.difficulty] - difficultyOrder[p2.difficulty]);
    if (diffDifference === 1) score += 5;

    // Shared topics = +20 points per topic
    const sharedTopics = p1.topics.filter(t => p2.topics.includes(t));
    score += sharedTopics.length * 20;

    return score;
}

/**
 * Find next harder problems with same topics
 */
export function findNextHarderProblems(
    problem: Problem,
    allProblems: Problem[],
    limit = 5
): Problem[] {
    const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
    const currentDifficultyLevel = difficultyOrder[problem.difficulty];

    return allProblems
        .filter(p => {
            const pLevel = difficultyOrder[p.difficulty];
            return pLevel > currentDifficultyLevel; // Only harder problems
        })
        .map(p => ({
            problem: p,
            score: calculateSimilarityScore(problem, p)
        }))
        .sort((a, b) => {
            // Sort by similarity score first, then by difficulty
            if (b.score !== a.score) return b.score - a.score;
            return difficultyOrder[a.problem.difficulty] - difficultyOrder[b.problem.difficulty];
        })
        .slice(0, limit)
        .map(item => item.problem);
}

/**
 * Calculate dataset statistics
 */
export function calculateStats(problems: Problem[]): DatasetStats {
    const stats: DatasetStats = {
        total: problems.length,
        byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
        topTopics: [],
        averageAcceptanceRate: 0,
        averageLikeRatio: 0
    };

    // Count by difficulty
    problems.forEach(p => {
        stats.byDifficulty[p.difficulty]++;
    });

    // Calculate averages
    const totalAcceptance = problems.reduce((sum, p) => sum + p.acceptanceRate, 0);
    stats.averageAcceptanceRate = totalAcceptance / problems.length;

    const totalLikeRatio = problems.reduce((sum, p) => sum + p.likeRatio, 0);
    stats.averageLikeRatio = totalLikeRatio / problems.length;

    // Count topics
    const topicCounts = new Map<string, number>();
    problems.forEach(p => {
        p.topics.forEach(topic => {
            topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
        });
    });

    // Get top 10 topics
    stats.topTopics = Array.from(topicCounts.entries())
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return stats;
}

/**
 * Get all unique topics from problems
 */
export function getAllTopics(problems: Problem[]): string[] {
    const topicsSet = new Set<string>();
    problems.forEach(p => {
        p.topics.forEach(topic => topicsSet.add(topic));
    });
    return Array.from(topicsSet).sort();
}

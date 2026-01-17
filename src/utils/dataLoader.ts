import { LeetCodeProblem, Problem } from '../types';

/**
 * Load LeetCode problems from the JSON file
 */
export async function loadProblems(): Promise<Problem[]> {
    try {
        const response = await fetch('/leetcode_questions.json');
        if (!response.ok) {
            throw new Error('Failed to load LeetCode problems');
        }

        const rawData: LeetCodeProblem[] = await response.json();
        return transformProblems(rawData);
    } catch (error) {
        console.error('Error loading LeetCode problems:', error);
        return [];
    }
}

/**
 * Transform raw JSON data to our Problem interface
 */
function transformProblems(rawProblems: LeetCodeProblem[]): Problem[] {
    return rawProblems.map(raw => ({
        id: raw.ID,
        name: raw['Problem Name'],
        difficulty: raw.Difficulty,
        topics: raw.Topics.split(', ').map(t => t.trim()),
        likes: raw.Likes,
        dislikes: raw.Dislikes,
        likeRatio: raw['Like Ratio'],
        acceptanceRate: parseFloat(raw['Accept Rate'].replace('%', '')),
        accepted: raw.Accepted,
        submissions: raw.Submissions,
        isFree: raw['Free?'].toLowerCase() === 'yes',
        hasSolution: raw['Solution?'].toLowerCase() === 'yes',
        hasVideoSolution: raw['Video Solution?'].toLowerCase() === 'yes',
        category: raw.Category
    }));
}

/**
 * Get LeetCode problem URL
 */
export function getLeetCodeUrl(problemName: string): string {
    const slug = problemName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
    return `https://leetcode.com/problems/${slug}/`;
}

// Core LeetCode Problem interface matching the JSON structure
export interface LeetCodeProblem {
  ID: number;
  'Problem Name': string;
  Likes: number;
  Dislikes: number;
  'Like Ratio': number;
  Topics: string;
  Difficulty: 'Easy' | 'Medium' | 'Hard';
  Accepted: number;
  Submissions: number;
  'Accept Rate': string;
  'Free?': string;
  'Solution?': string;
  'Video Solution?': string;
  Category: string;
}

// Simplified problem interface for UI display
export interface Problem {
  id: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  likes: number;
  dislikes: number;
  likeRatio: number;
  acceptanceRate: number;
  accepted: number;
  submissions: number;
  isFree: boolean;
  hasSolution: boolean;
  hasVideoSolution: boolean;
  category: string;
}

// UI State types
export type ProblemState = 'detected' | 'solved' | 'stuck' | 'none';
export type Platform = 'LeetCode' | 'Codeforces';

// Filter options
export interface ProblemFilters {
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  topics?: string[];
  minAcceptanceRate?: number;
  maxAcceptanceRate?: number;
  isFree?: boolean;
  searchQuery?: string;
}

// Sort options
export type SortOption = 'id' | 'likes' | 'acceptance' | 'difficulty';

// Statistics
export interface DatasetStats {
  total: number;
  byDifficulty: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  topTopics: Array<{ topic: string; count: number }>;
  averageAcceptanceRate: number;
  averageLikeRatio: number;
}

// Code templates for different programming languages

export interface CodeTemplate {
    language: string
    template: string
}

export const getCodeTemplate = (problemId: number, language: string): string => {
    // For now, we'll use Two Sum as the example. You can expand this for other problems.
    const templates: Record<string, Record<string, string>> = {
        javascript: {
            twoSum: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your code here
    
};

// Test cases
console.log(twoSum([2,7,11,15], 9)); // Expected: [0,1]
console.log(twoSum([3,2,4], 6)); // Expected: [1,2]
console.log(twoSum([3,3], 6)); // Expected: [0,1]`,
        },
        python: {
            twoSum: `from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
        pass

# Test cases
solution = Solution()
print(solution.twoSum([2,7,11,15], 9))  # Expected: [0,1]
print(solution.twoSum([3,2,4], 6))  # Expected: [1,2]
print(solution.twoSum([3,3], 6))  # Expected: [0,1]`,
        },
        java: {
            twoSum: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Solution solution = new Solution();
        
        // Test cases
        int[] result1 = solution.twoSum(new int[]{2,7,11,15}, 9);
        System.out.println("[" + result1[0] + "," + result1[1] + "]"); // Expected: [0,1]
        
        int[] result2 = solution.twoSum(new int[]{3,2,4}, 6);
        System.out.println("[" + result2[0] + "," + result2[1] + "]"); // Expected: [1,2]
    }
}`,
        },
        cpp: {
            twoSum: `#include <vector>
#include <iostream>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};

int main() {
    Solution solution;
    
    // Test cases
    vector<int> nums1 = {2, 7, 11, 15};
    vector<int> result1 = solution.twoSum(nums1, 9);
    cout << "[" << result1[0] << "," << result1[1] << "]" << endl; // Expected: [0,1]
    
    vector<int> nums2 = {3, 2, 4};
    vector<int> result2 = solution.twoSum(nums2, 6);
    cout << "[" << result2[0] << "," << result2[1] << "]" << endl; // Expected: [1,2]
    
    return 0;
}`,
        },
    }

    // Default to 'twoSum' for now
    const problemKey = 'twoSum'

    return templates[language]?.[problemKey] || templates.javascript[problemKey]
}

export const supportedLanguages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
]

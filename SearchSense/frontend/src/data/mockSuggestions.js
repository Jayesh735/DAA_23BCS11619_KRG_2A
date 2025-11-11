/**
 * Mock Suggestions Data
 * Used as fallback when backend is unavailable
 * Includes categories for context-aware suggestions
 */

export const mockSuggestionsData = [
  // Programming Languages
  { id: 1, term: 'Python', category: 'Programming', trending: true, popularity: 150 },
  { id: 2, term: 'JavaScript', category: 'Programming', trending: true, popularity: 200 },
  { id: 3, term: 'Java', category: 'Programming', trending: true, popularity: 180 },
  { id: 4, term: 'TypeScript', category: 'Programming', trending: true, popularity: 120 },
  { id: 5, term: 'React', category: 'Framework', trending: true, popularity: 190 },
  { id: 6, term: 'React hooks', category: 'Development', trending: false, popularity: 85 },
  { id: 7, term: 'React router', category: 'Development', trending: false, popularity: 60 },
  { id: 8, term: 'React performance', category: 'Development', trending: false, popularity: 45 },
  { id: 9, term: 'Node.js', category: 'Backend', trending: true, popularity: 140 },
  { id: 10, term: 'Express.js', category: 'Backend', trending: false, popularity: 70 },
  
  // Web Development
  { id: 11, term: 'CSS Grid', category: 'Web Design', trending: false, popularity: 55 },
  { id: 12, term: 'Web accessibility', category: 'Web Design', trending: false, popularity: 40 },
  { id: 13, term: 'HTML5', category: 'Web Design', trending: false, popularity: 50 },
  { id: 14, term: 'Tailwind CSS', category: 'Framework', trending: true, popularity: 110 },
  { id: 15, term: 'Next.js', category: 'Framework', trending: true, popularity: 130 },
  
  // AI & Tools
  { id: 16, term: 'AI-powered development', category: 'Tools', trending: true, popularity: 95 },
  { id: 17, term: 'Machine Learning', category: 'AI', trending: true, popularity: 100 },
  { id: 18, term: 'Deep Learning', category: 'AI', trending: false, popularity: 65 },
  
  // Architecture
  { id: 19, term: 'Serverless architecture', category: 'Architecture', trending: true, popularity: 80 },
  { id: 20, term: 'Microservices', category: 'Architecture', trending: false, popularity: 75 },
  { id: 21, term: 'GraphQL', category: 'API', trending: true, popularity: 90 },
  { id: 22, term: 'REST API', category: 'API', trending: false, popularity: 70 },
  
  // Mobile
  { id: 23, term: 'React Native', category: 'Mobile', trending: true, popularity: 85 },
  { id: 24, term: 'Flutter', category: 'Mobile', trending: false, popularity: 60 },
  
  // Testing
  { id: 25, term: 'Jest', category: 'Testing', trending: false, popularity: 55 },
  { id: 26, term: 'React Testing Library', category: 'Testing', trending: false, popularity: 50 },
  
  // Database
  { id: 27, term: 'MongoDB', category: 'Database', trending: false, popularity: 65 },
  { id: 28, term: 'PostgreSQL', category: 'Database', trending: false, popularity: 60 },
  { id: 29, term: 'Redis', category: 'Database', trending: false, popularity: 55 },
  
  // DevOps
  { id: 30, term: 'Docker', category: 'DevOps', trending: true, popularity: 100 },
  { id: 31, term: 'Kubernetes', category: 'DevOps', trending: false, popularity: 70 },
  { id: 32, term: 'CI/CD', category: 'DevOps', trending: false, popularity: 50 },
];

/**
 * Get mock suggestions matching a prefix
 * @param {string} prefix - Search prefix
 * @returns {Array} - Filtered suggestions
 */
export function getMockSuggestions(prefix) {
  if (!prefix || prefix.trim() === '') return [];
  
  const prefixLower = prefix.toLowerCase();
  return mockSuggestionsData
    .filter(item => 
      item.term.toLowerCase().includes(prefixLower) ||
      item.category.toLowerCase().includes(prefixLower)
    )
    .sort((a, b) => {
      // Sort by popularity first, then by exact match
      if (b.popularity !== a.popularity) {
        return b.popularity - a.popularity;
      }
      // Exact prefix match gets priority
      const aStarts = a.term.toLowerCase().startsWith(prefixLower);
      const bStarts = b.term.toLowerCase().startsWith(prefixLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.term.localeCompare(b.term);
    })
    .slice(0, 10);
}

/**
 * Get all unique categories
 * @returns {Array<string>} - Array of categories
 */
export function getAllCategories() {
  return [...new Set(mockSuggestionsData.map(item => item.category))];
}


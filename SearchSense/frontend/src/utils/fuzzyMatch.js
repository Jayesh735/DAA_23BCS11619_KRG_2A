/**
 * Fuzzy Matching using Levenshtein Distance (Edit Distance)
 * Handles typos and spelling errors
 */

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Edit distance (lower = more similar)
 */
export function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  
  // Create a 2D array for dynamic programming
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Initialize base cases
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // deletion
          dp[i][j - 1] + 1,     // insertion
          dp[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate similarity score (0-1, where 1 is identical)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity score
 */
export function similarityScore(str1, str2) {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLen;
}

/**
 * Find fuzzy matches from a list of terms
 * @param {string} query - Search query (may contain typos)
 * @param {Array<string>} terms - List of terms to search
 * @param {number} threshold - Minimum similarity score (0-1)
 * @param {number} maxResults - Maximum number of results
 * @returns {Array<{term: string, score: number}>} - Sorted by similarity
 */
export function findFuzzyMatches(query, terms, threshold = 0.6, maxResults = 10) {
  if (!query || query.trim() === '') return [];
  
  const queryLower = query.toLowerCase();
  const matches = [];

  for (const term of terms) {
    const termLower = term.toLowerCase();
    
    // Check exact prefix match first (highest priority)
    if (termLower.startsWith(queryLower)) {
      matches.push({ term, score: 1.0 });
      continue;
    }

    // Check if query is a substring
    if (termLower.includes(queryLower)) {
      matches.push({ term, score: 0.9 });
      continue;
    }

    // Calculate fuzzy similarity
    const score = similarityScore(queryLower, termLower);
    if (score >= threshold) {
      matches.push({ term, score });
    }
  }

  // Sort by score (descending) and return top results
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}


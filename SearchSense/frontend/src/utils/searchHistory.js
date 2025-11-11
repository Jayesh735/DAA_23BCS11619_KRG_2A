/**
 * Recent Search History Management
 * Uses localStorage for persistence
 * Implements Queue-like behavior (FIFO with max size)
 */

const STORAGE_KEY = 'searchsense_recent_searches';
const MAX_HISTORY_SIZE = 10;

/**
 * Get recent searches from localStorage
 * @returns {Array<string>} - Array of recent search terms
 */
export function getRecentSearches() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading search history:', error);
  }
  return [];
}

/**
 * Add a search term to history
 * @param {string} term - Search term to add
 */
export function addToHistory(term) {
  if (!term || term.trim() === '') return;

  try {
    let history = getRecentSearches();
    
    // Remove if already exists (to avoid duplicates)
    history = history.filter(item => item.toLowerCase() !== term.toLowerCase());
    
    // Add to front (most recent first)
    history.unshift(term.trim());
    
    // Limit size (Queue behavior - remove oldest if exceeds max)
    if (history.length > MAX_HISTORY_SIZE) {
      history = history.slice(0, MAX_HISTORY_SIZE);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
}

/**
 * Remove a search term from history
 * @param {string} term - Search term to remove
 */
export function removeFromHistory(term) {
  try {
    let history = getRecentSearches();
    history = history.filter(item => item.toLowerCase() !== term.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error removing from search history:', error);
  }
}

/**
 * Clear all search history
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
}

/**
 * Get filtered recent searches matching a prefix
 * @param {string} prefix - Prefix to filter by
 * @param {number} maxResults - Maximum number of results
 * @returns {Array<string>} - Filtered recent searches
 */
export function getFilteredRecentSearches(prefix = '', maxResults = 5) {
  const history = getRecentSearches();
  
  if (!prefix || prefix.trim() === '') {
    return history.slice(0, maxResults);
  }
  
  const prefixLower = prefix.toLowerCase();
  return history
    .filter(term => term.toLowerCase().includes(prefixLower))
    .slice(0, maxResults);
}


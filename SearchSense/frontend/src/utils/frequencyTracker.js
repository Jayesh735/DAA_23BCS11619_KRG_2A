/**
 * Frequency-Based Ranking Tracker
 * Tracks how often each query is searched
 * Uses HashMap for O(1) frequency lookups
 */

const STORAGE_KEY = 'searchsense_frequency_map';
const MAX_ENTRIES = 1000; // Limit to prevent localStorage bloat

/**
 * Get frequency map from localStorage
 * @returns {Map<string, number>} - Map of term -> frequency count
 */
function getFrequencyMap() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return new Map(Object.entries(data));
    }
  } catch (error) {
    console.error('Error reading frequency map:', error);
  }
  return new Map();
}

/**
 * Save frequency map to localStorage
 * @param {Map<string, number>} frequencyMap - Map to save
 */
function saveFrequencyMap(frequencyMap) {
  try {
    // Convert Map to object for JSON storage
    const obj = Object.fromEntries(frequencyMap);
    
    // Limit size by keeping only top entries
    const entries = Object.entries(obj);
    if (entries.length > MAX_ENTRIES) {
      // Sort by frequency and keep top entries
      entries.sort((a, b) => b[1] - a[1]);
      const limited = entries.slice(0, MAX_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(limited)));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    }
  } catch (error) {
    console.error('Error saving frequency map:', error);
  }
}

/**
 * Increment frequency count for a search term
 * @param {string} term - Search term
 */
export function incrementFrequency(term) {
  if (!term || term.trim() === '') return;

  const frequencyMap = getFrequencyMap();
  const termLower = term.toLowerCase().trim();
  const currentCount = frequencyMap.get(termLower) || 0;
  frequencyMap.set(termLower, currentCount + 1);
  saveFrequencyMap(frequencyMap);
}

/**
 * Get frequency count for a search term
 * @param {string} term - Search term
 * @returns {number} - Frequency count
 */
export function getFrequency(term) {
  if (!term || term.trim() === '') return 0;
  
  const frequencyMap = getFrequencyMap();
  return frequencyMap.get(term.toLowerCase().trim()) || 0;
}

/**
 * Sort suggestions by frequency (most popular first)
 * @param {Array} suggestions - Array of suggestion objects
 * @returns {Array} - Sorted suggestions
 */
export function sortByFrequency(suggestions) {
  return [...suggestions].sort((a, b) => {
    const freqA = getFrequency(a.text || a.term || '');
    const freqB = getFrequency(b.text || b.term || '');
    
    // Sort by frequency (descending), then alphabetically
    if (freqB !== freqA) {
      return freqB - freqA;
    }
    return (a.text || a.term || '').localeCompare(b.text || b.term || '');
  });
}

/**
 * Clear frequency map
 */
export function clearFrequencyMap() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing frequency map:', error);
  }
}


import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Clock, X, Sparkles } from 'lucide-react'
import './AutocompleteSearchBar.css'

// Import utilities
import { LRUCache } from '../utils/lruCache'
import { findFuzzyMatches } from '../utils/fuzzyMatch'
import { getRecentSearches, addToHistory, removeFromHistory, getFilteredRecentSearches } from '../utils/searchHistory'
import { incrementFrequency, sortByFrequency } from '../utils/frequencyTracker'
import { getMockSuggestions } from '../data/mockSuggestions'

// Initialize LRU Cache for prefix caching
const prefixCache = new LRUCache(50)

// Mock trending searches (can be replaced with API call)
const mockTrendingSearches = [
  { text: 'AI-powered development tools', count: '2.4M' },
  { text: 'Web3 integration guide', count: '1.8M' },
  { text: 'Serverless architecture', count: '1.2M' },
  { text: 'GraphQL best practices', count: '890K' },
]

export default function AutocompleteSearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [useFuzzy, setUseFuzzy] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Load recent searches from localStorage on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  // Main effect: Fetch suggestions with all advanced features
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([])
      setSelectedIndex(-1)
      return
    }

    const timerId = setTimeout(() => {
      fetchSuggestions(query.trim())
    }, 300) // Debounce

    return () => clearTimeout(timerId)
  }, [query])

  /**
   * Fetch suggestions with caching, fuzzy matching, and fallback
   */
  const fetchSuggestions = async (prefix) => {
    setIsLoading(true)
    
    try {
      // 1. Check LRU Cache first (O(1) lookup)
      const cached = prefixCache.get(prefix)
      if (cached) {
        setSuggestions(cached)
        setIsLoading(false)
        return
      }

      // 2. Try fetching from backend API
      let fetchedSuggestions = []
      try {
        const response = await fetch(`http://localhost:9090/api/autocomplete?q=${encodeURIComponent(prefix)}`)
        
        if (response.ok) {
          const data = await response.json()
          fetchedSuggestions = data.map(item => ({
            id: item.id,
            text: item.term,
            category: item.category,
            trending: item.trending,
            popularity: item.popularity || 0
          }))
        } else {
          throw new Error('API error')
        }
      } catch (apiError) {
        // 3. Fallback to mock data if API fails
        console.log('Using mock suggestions (backend unavailable)')
        const mockData = getMockSuggestions(prefix)
        fetchedSuggestions = mockData.map(item => ({
          id: item.id,
          text: item.term,
          category: item.category,
          trending: item.trending,
          popularity: item.popularity || 0
        }))
      }

      // 4. If no exact matches and fuzzy matching enabled, try fuzzy search
      if (fetchedSuggestions.length === 0 && prefix.length >= 3) {
        const allTerms = getMockSuggestions('').map(item => item.term)
        const fuzzyMatches = findFuzzyMatches(prefix, allTerms, 0.6, 10)
        
        if (fuzzyMatches.length > 0) {
          setUseFuzzy(true)
          // Convert fuzzy matches to suggestion format
          fetchedSuggestions = fuzzyMatches.map((match, idx) => ({
            id: `fuzzy-${idx}`,
            text: match.term,
            category: 'Suggested',
            trending: false,
            popularity: Math.floor(match.score * 100),
            isFuzzy: true
          }))
        }
      } else {
        setUseFuzzy(false)
      }

      // 5. Apply frequency-based ranking
      fetchedSuggestions = sortByFrequency(fetchedSuggestions)

      // 6. Group by category for context-aware display
      const grouped = groupByCategory(fetchedSuggestions)

      // 7. Cache the results
      prefixCache.put(prefix, grouped)

      setSuggestions(grouped)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Group suggestions by category (context-aware)
   */
  const groupByCategory = (suggestions) => {
    if (suggestions.length === 0) return []

    const categoryMap = new Map()
    
    suggestions.forEach(item => {
      const category = item.category || 'Other'
      if (!categoryMap.has(category)) {
        categoryMap.set(category, [])
      }
      categoryMap.get(category).push(item)
    })

    // Convert to flat array with category headers
    const grouped = []
    categoryMap.forEach((items, category) => {
      grouped.push({ type: 'category', category, items: [] })
      items.forEach(item => grouped.push({ ...item, category }))
    })

    return grouped
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true)
      return
    }

    // Filter out category headers for navigation
    const navigableItems = suggestions.filter(item => item.type !== 'category')
    if (navigableItems.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => {
        if (prev < navigableItems.length - 1) {
          return prev + 1
        }
        return prev
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && navigableItems[selectedIndex]) {
        handleSelectSuggestion(navigableItems[selectedIndex].text)
      } else if (query.trim()) {
        handleSelectSuggestion(query)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  // Handle suggestion selection
  const handleSelectSuggestion = (text) => {
    // Track frequency
    incrementFrequency(text)
    
    // Add to history
    addToHistory(text)
    setRecentSearches(getRecentSearches())

    // Track in backend (fire-and-forget)
    fetch(`http://localhost:9090/api/select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(text)
    }).catch(err => console.error('Error tracking selection:', err))

    setQuery(text)
    setIsOpen(false)
    navigate(`/search?q=${encodeURIComponent(text)}`)
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    inputRef.current?.focus()
  }

  const removeRecentSearch = (text) => {
    removeFromHistory(text)
    setRecentSearches(getRecentSearches())
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim() === '') return
    handleSelectSuggestion(query)
  }

  // Get filtered recent searches matching current query
  const filteredRecentSearches = useMemo(() => {
    return getFilteredRecentSearches(query, 5)
  }, [query])

  // Render suggestions grouped by category
  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      return (
        <div className="dropdown-empty">
          <p>No results found for "{query}"</p>
          {query.length >= 3 && (
            <p className="dropdown-empty-hint">Try checking your spelling or use different keywords</p>
          )}
        </div>
      )
    }

    let currentCategory = null
    const items = []

    suggestions.forEach((item, idx) => {
      // Category header
      if (item.type === 'category') {
        currentCategory = item.category
        items.push(
          <h4 key={`cat-${currentCategory}`} className="dropdown-header">
            <Sparkles className="dropdown-header-icon" />
            {currentCategory}
          </h4>
        )
        return
      }

      // Regular suggestion item - calculate index in navigable items
      const navigableItems = suggestions.filter(s => s.type !== 'category')
      const itemIndex = navigableItems.findIndex(navItem => navItem.id === item.id || navItem.text === item.text)
      const isSelected = selectedIndex >= 0 && itemIndex === selectedIndex
      
      items.push(
        <div
          key={item.id || idx}
          className={`dropdown-item suggestion-item ${isSelected ? 'selected' : ''} ${item.isFuzzy ? 'fuzzy-match' : ''}`}
          onClick={() => handleSelectSuggestion(item.text)}
          onMouseEnter={() => {
            const navigableItems = suggestions.filter(s => s.type !== 'category')
            const itemIndex = navigableItems.findIndex(navItem => navItem.id === item.id || navItem.text === item.text)
            if (itemIndex >= 0) {
              setSelectedIndex(itemIndex)
            }
          }}
        >
          <div className="item-text-group">
            <span className="item-text">{item.text}</span>
            {item.category && (
              <span className="item-category">{item.category}</span>
            )}
          </div>
          <div className="item-badges">
            {item.isFuzzy && (
              <span className="item-fuzzy-badge" title="Fuzzy match - may contain typos">
                ~
              </span>
            )}
            {item.trending && (
              <span className="item-trending-tag">
                <TrendingUp className="item-trending-icon" />
                Trending
              </span>
            )}
          </div>
        </div>
      )
    })

    return <div className="dropdown-section">{items}</div>
  }

  return (
    <div className="search-wrapper" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="search-container">
        <Search className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for anything..."
          className="search-input"
          autoComplete="off"
        />
        {isLoading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
        {query && (
          <button type="button" onClick={clearSearch} className="clear-button">
            <X className="clear-icon" />
          </button>
        )}
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {isOpen && (
        <div className="dropdown-menu">
          {query.trim() === '' ? (
            <div className="dropdown-section">
              {recentSearches.length > 0 && (
                <div className="dropdown-subsection">
                  <h4 className="dropdown-header">
                    <Clock className="dropdown-header-icon" />
                    Recent Searches
                  </h4>
                  {recentSearches.slice(0, 5).map((item, idx) => (
                    <div
                      key={idx}
                      className="dropdown-item recent-item"
                      onClick={() => handleSelectSuggestion(item)}
                    >
                      <span className="item-text">{item}</span>
                      <button
                        className="remove-recent-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeRecentSearch(item)
                        }}
                      >
                        <X className="remove-recent-icon" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="dropdown-subsection">
                <h4 className="dropdown-header">
                  <TrendingUp className="dropdown-header-icon" />
                  Trending Now
                </h4>
                {mockTrendingSearches.map((item, idx) => (
                  <div
                    key={idx}
                    className="dropdown-item"
                    onClick={() => handleSelectSuggestion(item.text)}
                  >
                    <span className="item-text">{item.text}</span>
                    <span className="item-trending-count">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            renderSuggestions()
          )}
        </div>
      )}
    </div>
  )
}

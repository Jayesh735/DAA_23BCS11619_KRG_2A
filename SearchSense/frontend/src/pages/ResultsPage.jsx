import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Clock, TrendingUp, Sparkles, ExternalLink } from 'lucide-react'
import AutocompleteSearchBar from '../components/AutocompleteSearchBar'
import './ResultsPage.css'

export default function ResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchStats, setSearchStats] = useState(null)

  useEffect(() => {
    if (query) {
      fetchResults(query)
    }
  }, [query])

  const fetchResults = async (searchQuery) => {
    setIsLoading(true)
    setError(null)

    try {
      // Try to fetch from backend API
      const response = await fetch(`http://localhost:9090/api/search?q=${encodeURIComponent(searchQuery)}`)
      
      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
        setSearchStats(data.stats || null)
      } else {
        // Fallback to mock results
        generateMockResults(searchQuery)
      }
    } catch (err) {
      console.log('Using mock results (backend unavailable)')
      generateMockResults(searchQuery)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockResults = (searchQuery) => {
    // Generate contextual mock results based on query
    const mockResults = [
      {
        id: 1,
        title: `${searchQuery} - Complete Guide`,
        url: `https://example.com/${searchQuery.toLowerCase().replace(/\s+/g, '-')}`,
        snippet: `Learn everything about ${searchQuery}. This comprehensive guide covers all aspects including best practices, examples, and real-world applications. Perfect for developers looking to master ${searchQuery}.`,
        category: 'Documentation',
        relevance: 0.95
      },
      {
        id: 2,
        title: `Getting Started with ${searchQuery}`,
        url: `https://example.com/getting-started-${searchQuery.toLowerCase().replace(/\s+/g, '-')}`,
        snippet: `New to ${searchQuery}? Start here! This tutorial walks you through the basics, setup instructions, and your first project. Follow along step-by-step to build your first ${searchQuery} application.`,
        category: 'Tutorial',
        relevance: 0.88
      },
      {
        id: 3,
        title: `${searchQuery} Best Practices and Patterns`,
        url: `https://example.com/best-practices-${searchQuery.toLowerCase().replace(/\s+/g, '-')}`,
        snippet: `Discover industry-proven best practices for ${searchQuery}. Learn from expert developers about common patterns, performance optimization, and avoiding pitfalls.`,
        category: 'Best Practices',
        relevance: 0.82
      },
      {
        id: 4,
        title: `Advanced ${searchQuery} Techniques`,
        url: `https://example.com/advanced-${searchQuery.toLowerCase().replace(/\s+/g, '-')}`,
        snippet: `Take your ${searchQuery} skills to the next level. Explore advanced concepts, optimization strategies, and cutting-edge techniques used by senior developers.`,
        category: 'Advanced',
        relevance: 0.75
      },
      {
        id: 5,
        title: `${searchQuery} Community Resources`,
        url: `https://example.com/community-${searchQuery.toLowerCase().replace(/\s+/g, '-')}`,
        snippet: `Join the ${searchQuery} community! Find forums, Discord servers, GitHub repositories, and other resources to connect with fellow developers and contribute to the ecosystem.`,
        category: 'Community',
        relevance: 0.70
      }
    ]

    setResults(mockResults)
    setSearchStats({
      totalResults: 1250,
      searchTime: 0.045,
      query: searchQuery
    })
  }

  const highlightQuery = (text, query) => {
    if (!query || !text) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="highlight">{part}</mark>
      ) : (
        part
      )
    )
  }

  if (!query) {
    return (
      <div className="results-container">
        <div className="results-empty-state">
          <Search className="empty-state-icon" />
          <h2>Start Your Search</h2>
          <p>Enter a search query above to find results</p>
          <div className="results-search-bar">
            <AutocompleteSearchBar />
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="results-container">
      <div className="results-header">
        <div className="results-title-section">
          <h2 className="results-title">
            Results for: <span className="results-query">"{query}"</span>
          </h2>
          {searchStats && (
            <p className="results-stats">
              About {searchStats.totalResults?.toLocaleString() || '0'} results 
              ({searchStats.searchTime ? searchStats.searchTime.toFixed(3) : '0'} seconds)
            </p>
          )}
        </div>
        <div className="results-search-bar">
          <AutocompleteSearchBar />
        </div>
      </div>

      {isLoading ? (
        <div className="results-loading">
          <div className="loading-spinner-large"></div>
          <p>Searching for "{query}"...</p>
        </div>
      ) : error ? (
        <div className="results-error">
          <p>Error: {error}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="results-empty">
          <Sparkles className="empty-icon" />
          <h3>No results found</h3>
          <p>Try adjusting your search terms or check your spelling</p>
        </div>
      ) : (
        <>
          <div className="results-list">
            {results.map((result) => (
              <div key={result.id} className="result-item">
                <div className="result-item-header">
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="result-item-title"
                  >
                    {highlightQuery(result.title, query)}
                    <ExternalLink className="external-link-icon" />
                  </a>
                  <span className="result-item-url">{result.url}</span>
                </div>
                <p className="result-item-desc">
                  {highlightQuery(result.snippet, query)}
                </p>
                <div className="result-item-footer">
                  {result.category && (
                    <span className="result-category-badge">
                      <Sparkles className="category-icon" />
                      {result.category}
                    </span>
                  )}
                  {result.relevance && (
                    <span className="result-relevance">
                      {Math.round(result.relevance * 100)}% relevant
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="results-pagination">
            <button className="pagination-button" disabled>
              Previous
            </button>
            <div className="pagination-info">
              Page 1 of 10
            </div>
            <button className="pagination-button">
              Next
            </button>
          </div>
        </>
      )}
    </main>
  )
}

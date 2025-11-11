import React from 'react'
import AutocompleteSearchBar from '../components/AutocompleteSearchBar'
import { Sparkles, Search, TrendingUp } from 'lucide-react'
import './HomePage.css' // Import the CSS

// Features data
const features = [
  { title: 'Smart Suggestions', desc: 'AI-powered autocomplete', icon: Sparkles },
  { title: 'Lightning Fast', desc: 'Instant search results', icon: Search },
  { title: 'Trending Topics', desc: 'Stay up to date', icon: TrendingUp },
]

export default function HomePage() {
  return (
    <div className="homepage-container">
      <div className="homepage-hero">
        <h2 className="homepage-title">Discover Everything</h2>
        <p className="homepage-subtitle">
          Start typing to explore intelligent suggestions
        </p>
      </div>

      <AutocompleteSearchBar />

      <div className="features-grid">
        {features.map((feature, idx) => {
          const Icon = feature.icon // Get the icon component
          return (
            <div key={idx} className="feature-card">
              <div className="feature-icon-wrapper">
                <Icon className="feature-icon" />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
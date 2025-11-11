import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import './Layout.css' // Import the CSS

function Layout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <div className="logo-icon">
              <Sparkles className="logo-svg" />
            </div>
            <div>
              <h1 className="logo-title">SearchSense</h1>
              <p className="logo-subtitle">Intelligent Search Experience</p>
            </div>
          </Link>
        </div>
      </header>

      {/* This Outlet renders the active page */}
      <main className="layout-main">
        <Outlet />
      </main>

      <footer className="layout-footer">
        <p>Built with React & Java</p>
      </footer>
    </div>
  )
}

export default Layout
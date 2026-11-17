import React from 'react';

/**
 * Navbar Component
 * Displays Blinkit branding, search bar, AI assistant trigger, and Cart counter.
 * Beginner-friendly: receives search query state and modal toggle handlers as props.
 */
export default function Navbar({
  searchQuery,
  onSearchChange,
  cartTotalItems,
  onOpenCart,
  onOpenAiChat
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Left: Logo & Delivery Location */}
        <div className="nav-left">
          <div className="brand-logo">
            <span className="blink">blink</span>
            <span className="it">it</span>
          </div>

          <div className="delivery-badge">
            <span className="delivery-time">⚡ Delivery in 10 minutes</span>
            <span className="delivery-location">Delhi NCR, India ▾</span>
          </div>
        </div>

        {/* Center: Live Product Search */}
        <div className="nav-search">
          <svg
            className="search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search 'milk', 'chips', 'paneer'..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Right: AI Concierge & Cart Buttons */}
        <div className="nav-actions">
          <button
            className="ai-trigger-btn"
            onClick={onOpenAiChat}
            title="Ask AI Shopping Concierge"
          >
            <span className="ai-sparkle-icon">✨</span>
            <span>Ask Blinkit AI</span>
          </button>

          <button className="cart-btn" onClick={onOpenCart}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>My Cart</span>
            {cartTotalItems > 0 && (
              <span className="cart-count-badge">{cartTotalItems}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

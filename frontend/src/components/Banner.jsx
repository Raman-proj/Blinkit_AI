import React from 'react';

/**
 * Banner Component
 * Displays attractive grocery delivery offer and promotes the AI Visual Search.
 */
export default function Banner({ onOpenAiChat }) {
  return (
    <div className="hero-banner">
      <div className="banner-text">
        <h2>Groceries Delivered in 10 Minutes ⚡</h2>
        <p>
          Need recipe ingredients or party snacks? Upload a photo or ask our AI
          Concierge!
        </p>
      </div>

      <button className="banner-ai-action" onClick={onOpenAiChat}>
        <span>📸 Search by Photo</span>
        <span>✨ Try AI</span>
      </button>
    </div>
  );
}

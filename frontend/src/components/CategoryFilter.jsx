import React from 'react';

/**
 * CategoryFilter Component
 * Allows user to switch between grocery categories (All, Snacks, Sweets, Dairy, etc.)
 */
export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory
}) {
  return (
    <div className="category-filter-container">
      <div className="category-list">
        {categories.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

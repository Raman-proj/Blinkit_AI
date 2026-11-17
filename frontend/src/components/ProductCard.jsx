import React, { useState } from 'react';

/**
 * ProductCard Component
 * Displays product image/emoji, dietary status, price, and Add/Quantity button.
 */
export default function ProductCard({
  product,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="product-card">
      {/* Product Image / Emoji */}
      <div className="product-img-box">
        {/* Veg / Non-veg dot indicator */}
        <div className="dietary-badge" title={product.dietary}>
          <div className={`diet-dot ${product.dietary || 'veg'}`} />
        </div>

        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="product-emoji-fallback">{product.emoji || '🛍️'}</div>
        )}
      </div>

      {/* Category Tag */}
      <span className="product-category-tag">{product.category}</span>

      {/* Product Name */}
      <h4 className="product-name" title={product.name}>
        {product.name}
      </h4>

      {/* Product Description */}
      <p className="product-desc" title={product.desc}>
        {product.desc}
      </p>

      {/* Footer: Price & Add to Cart button */}
      <div className="product-card-footer">
        <span className="product-price">₹{product.price}</span>

        {quantityInCart === 0 ? (
          <button
            className="btn-add"
            onClick={() => onAddToCart(product)}
            title="Add to cart"
          >
            ADD
          </button>
        ) : (
          <div className="quantity-controller">
            <button
              onClick={() => onRemoveFromCart(product.id)}
              title="Decrease quantity"
            >
              -
            </button>
            <span>{quantityInCart}</span>
            <button
              onClick={() => onAddToCart(product)}
              title="Increase quantity"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import ProductCard from './ProductCard';

/**
 * ProductList Component
 * Renders the responsive grid of products.
 */
export default function ProductList({
  products,
  cart,
  onAddToCart,
  onRemoveFromCart
}) {
  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
        <h3>No products found</h3>
        <p>Try searching for something else like 'lays', 'milk', or 'chocolate'</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id);
        const quantity = cartItem ? cartItem.quantity : 0;

        return (
          <ProductCard
            key={product.id}
            product={product}
            quantityInCart={quantity}
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
          />
        );
      })}
    </div>
  );
}

import React from 'react';

/**
 * CartModal Component
 * Slide-out drawer showing cart items, quantity controller, bill summary, and checkout button.
 */
export default function CartModal({
  isOpen,
  onClose,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onClearCart
}) {
  if (!isOpen) return null;

  // Calculate bill totals
  const itemTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = itemTotal >= 199 || itemTotal === 0 ? 0 : 25;
  const grandTotal = itemTotal + deliveryFee;

  const handleCheckout = () => {
    alert(`🎉 Order Placed Successfully!\n\nTotal Paid: ₹${grandTotal}\nDelivery arriving in 10 minutes.`);
    onClearCart();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Cart Header */}
        <div className="cart-header">
          <h3>My Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)</h3>
          <button className="close-btn" onClick={onClose} title="Close Cart">
            &times;
          </button>
        </div>

        {/* Cart Items List */}
        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div className="empty-cart-view">
              <div className="empty-cart-icon">🛒</div>
              <h4>Your cart is empty</h4>
              <p>Add some delicious snacks or fresh groceries to get started!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div className="cart-item-img">
                  {item.emoji || '🛍️'}
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price * item.quantity}</div>
                </div>

                <div className="quantity-controller">
                  <button onClick={() => onRemoveFromCart(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onAddToCart(item)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer / Bill Summary */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="bill-row">
              <span>Item Total</span>
              <span>₹{itemTotal}</span>
            </div>

            <div className="bill-row">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>

            <div className="bill-total-row">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>

            <button className="btn-checkout" onClick={handleCheckout}>
              Proceed to Pay • ₹{grandTotal}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import CategoryFilter from './components/CategoryFilter';
import ProductList from './components/ProductList';
import CartModal from './components/CartModal';
import AIChatDrawer from './components/AIChatDrawer';
import './App.css';

// Default categories in case backend is still booting
const INITIAL_CATEGORIES = [
  'All',
  'Snacks',
  'Sweets',
  'Dairy',
  'Beverages',
  'Meat',
  'Breakfast',
  'Groceries'
];

export default function App() {
  // 1. App State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch Products and Categories from Express backend
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.warn('Could not fetch from backend, check if backend is running on port 5000:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/products/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.warn('Using default categories');
    }
  };

  // 3. Cart Operations
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === productId);
      if (!existing) return prevCart;

      if (existing.quantity === 1) {
        return prevCart.filter((item) => item.id !== productId);
      }

      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // 4. Filter products by category & search term
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory.toLowerCase() === 'all' ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const cartTotalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartTotalItems={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiChat={() => setIsAiOpen(true)}
      />

      {/* Main Body */}
      <main className="main-content">
        {/* Promotional Banner */}
        <Banner onOpenAiChat={() => setIsAiOpen(true)} />

        {/* Category Pills Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Section Title & Count */}
        <div className="section-header">
          <h2 className="section-title">
            {selectedCategory === 'All' ? 'Trending Groceries' : selectedCategory}
          </h2>
          <span className="item-count">
            {filteredProducts.length} items available
          </span>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            <p>Loading catalog from server...</p>
          </div>
        ) : (
          <ProductList
            products={filteredProducts}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
          />
        )}
      </main>

      {/* Slide-out Cart Drawer */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Slide-out AI Concierge Drawer */}
      <AIChatDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

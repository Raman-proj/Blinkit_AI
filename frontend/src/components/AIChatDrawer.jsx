import React, { useState, useRef, useEffect } from 'react';

/**
 * AIChatDrawer Component
 * ---------------------
 * Blinkit AI Shopping Concierge:
 * 1. Text Search & Conversational Recommendations
 * 2. Visual Photo Search via Image Upload (Base64)
 * 3. Quick Intent Chips (Movie snacks, Recipe ingredients, etc.)
 * 4. Embedded product cards with direct "Add to Cart"
 */
export default function AIChatDrawer({
  isOpen,
  onClose,
  onAddToCart
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "👋 Hi! I'm your Blinkit AI Concierge. You can ask me for recipe ingredients, party snacks, or upload a grocery photo to search visually!",
      products: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // Base64 data URL
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat when new message arrives
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  if (!isOpen) return null;

  // Handle image file selection and conversion to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result); // Base64 string
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Send message to Express backend (/api/chat)
  const handleSendMessage = async (textToSend = inputText) => {
    const trimmed = textToSend.trim();
    if (!trimmed && !selectedImage) return;

    // Capture current payload values
    const outgoingText = trimmed || (selectedImage ? 'Visual Search (Photo uploaded)' : '');
    const outgoingImage = selectedImage;

    // Append user message to UI
    const userMsg = {
      role: 'user',
      text: outgoingText,
      image: outgoingImage
    };
    setMessages((prev) => [...prev, userMsg]);

    // Reset input fields
    setInputText('');
    handleClearImage();
    setIsLoading(true);

    try {
      // Call Express API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: outgoingText,
          image: outgoingImage,
          history: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.text
          }))
        })
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `⚠️ ${data.error}`,
            products: []
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.reply || "Here are matching products I found for you:",
            products: data.products || []
          }
        ]);
      }
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "I couldn't reach the server right now. Make sure the backend is running on port 5000!",
          products: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick prompt chip clicked
  const handleQuickChip = (promptText) => {
    setInputText(promptText);
    handleSendMessage(promptText);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="ai-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ai-drawer-header">
          <div className="ai-header-info">
            <div className="ai-avatar">🤖</div>
            <div>
              <div className="ai-header-title">Blinkit AI Concierge</div>
              <div className="ai-header-subtitle">Text & Visual Grocery Assistant</div>
            </div>
          </div>
          <button className="close-btn" style={{ color: 'white' }} onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="ai-prompt-suggestions">
          <button
            className="prompt-chip"
            onClick={() => handleQuickChip('I want to make paneer butter masala')}
          >
            🍛 Paneer Butter Masala
          </button>
          <button
            className="prompt-chip"
            onClick={() => handleQuickChip('Snacks for movie night')}
          >
            🍿 Movie Snacks
          </button>
          <button
            className="prompt-chip"
            onClick={() => handleQuickChip('Healthy breakfast items')}
          >
            🥣 Healthy Breakfast
          </button>
          <button
            className="prompt-chip"
            onClick={() => handleQuickChip('Craving sweet chocolates')}
          >
            🍫 Sweet Cravings
          </button>
        </div>

        {/* Chat History */}
        <div className="ai-chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-bubble ${msg.role}`}>
              {/* If user attached an image */}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Uploaded"
                  className="chat-uploaded-img"
                />
              )}

              {/* Message text */}
              <div>{msg.text}</div>

              {/* Embedded product recommendation cards */}
              {msg.products && msg.products.length > 0 && (
                <div className="ai-recommendation-grid">
                  {msg.products.map((p) => (
                    <div key={p.id} className="ai-recommend-card">
                      <div className="ai-rec-img-box">
                        {p.emoji || '🛍️'}
                      </div>
                      <div className="ai-rec-name" title={p.name}>
                        {p.name}
                      </div>
                      <div className="ai-rec-price">₹{p.price}</div>
                      <button
                        className="ai-btn-add"
                        onClick={() => onAddToCart(p)}
                      >
                        + Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="loading-bubble">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Upload Preview Bar */}
        {selectedImage && (
          <div className="upload-preview-bar">
            <img
              src={selectedImage}
              alt="Preview"
              className="preview-thumbnail"
            />
            <span className="preview-text">📸 Photo ready to search</span>
            <button
              className="btn-remove-preview"
              onClick={handleClearImage}
              title="Remove image"
            >
              &times;
            </button>
          </div>
        )}

        {/* Chat Input Controls */}
        <div className="ai-input-area">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageUpload}
          />

          {/* Camera / Upload Button */}
          <button
            className="btn-upload-icon"
            onClick={() => fileInputRef.current?.click()}
            title="Upload photo to search"
          >
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
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>

          {/* Text Input */}
          <input
            type="text"
            className="ai-chat-input"
            placeholder={
              selectedImage
                ? "Add an optional prompt or press Send..."
                : "Ask for ingredients or items..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
          />

          {/* Send Button */}
          <button
            className="btn-ai-send"
            onClick={() => handleSendMessage()}
            title="Send"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

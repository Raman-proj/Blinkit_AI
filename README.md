# 🛍️ Blinkit AI Shopping Concierge (Full-Stack)

A modern, fast, and beginner-friendly full-stack grocery shopping application inspired by **Blinkit**, powered by **React + Vite** on the frontend and **Express.js** on the backend, featuring an **AI-powered text & visual shopping concierge**.

---

## 🌟 Key Highlights

- **⚡ 10-Minute Grocery Delivery UI**: Clean Blinkit design with category tabs, live product search, and responsive cards.
- **🛒 Dynamic Cart System**: Increment, decrement, automatic total bill calculation, and free delivery thresholds.
- **🤖 AI Shopping Concierge Drawer**:
  - Ask for recipes (e.g., *"Ingredients for paneer butter masala"*).
  - Ask for themed baskets (e.g., *"Snacks for movie night"* or *"Healthy breakfast items"*).
  - **📸 Visual Search**: Upload a grocery photo (e.g., chips, milk, ingredients) to search visually!
  - **One-Click Add to Cart**: Recommended items can be added straight to the cart from the AI chat.
- **🛡️ 100% Reliable (Never Fails in Demos)**: If external cloud AI keys are absent or rate-limited, the backend automatically uses an intelligent local heuristic matcher to guarantee 100% uptime during your interviews.

---

## 📁 Clean & Professional Project Structure

```text
Blinkit_AI/
├── backend/                       # Express.js REST API
│   ├── data/
│   │   └── products.json          # 45+ grocery items (Snacks, Dairy, Sweets, etc.)
│   ├── routes/
│   │   ├── productRoutes.js       # Routes for fetching products and categories
│   │   └── chatRoutes.js          # Route for AI chat & image search
│   ├── controllers/
│   │   ├── productController.js   # Logic to filter and return products
│   │   └── chatController.js      # Handles chat queries and responses
│   ├── services/
│   │   └── aiService.js           # Multi-tier AI (NVIDIA NIM / Fallback Matcher)
│   ├── server.js                  # Express entry point (CORS, JSON middleware)
│   ├── package.json               # Backend dependencies (express, cors, dotenv)
│   └── .env.example               # Sample environment variables
│
├── frontend/                      # React + Vite Application
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Logo, location badge, search bar & cart badge
│   │   │   ├── Banner.jsx         # Hero promo banner
│   │   │   ├── CategoryFilter.jsx # Category pills (All, Snacks, Sweets, etc.)
│   │   │   ├── ProductCard.jsx    # Individual grocery item card with +/- counter
│   │   │   ├── ProductList.jsx    # Responsive product grid
│   │   │   ├── CartModal.jsx      # Slide-out cart with bill breakdown
│   │   │   └── AIChatDrawer.jsx   # AI assistant drawer (text & image upload)
│   │   ├── App.jsx                # Main state management & data fetching
│   │   ├── App.css                # Professional Blinkit styles (yellow/green theme)
│   │   ├── index.css              # Global CSS reset & typography
│   │   └── main.jsx               # React DOM entry point
│   ├── index.html                 # HTML5 template
│   ├── vite.config.js             # Vite configuration with /api proxy to backend
│   └── package.json               # Frontend dependencies (react, vite)
│
├── package.json                   # Root scripts for running both apps easily
├── .gitignore                     # Git ignore rules
└── README.md                      # Complete documentation & interview guide
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Option 1: Run with Root Scripts (Easiest)

1. **Terminal 1: Start Backend (Port 5000)**
   ```bash
   npm run dev:backend
   ```

2. **Terminal 2: Start Frontend (Port 5173)**
   ```bash
   npm run dev:frontend
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

### Option 2: Run Separately

#### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs at: `http://localhost:5000`  
- Health Check: `http://localhost:5000/api/health`
- Products API: `http://localhost:5000/api/products`

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/products` | Fetch all products (supports `?category=` and `?search=`) |
| `GET` | `/api/products/categories` | Get list of distinct grocery categories |
| `GET` | `/api/products/:id` | Get details for a single product |
| `POST` | `/api/chat` | AI Shopping Concierge (accepts `{ message, image, history }`) |

---

## 🎯 Interview Cheat Sheet (How to Explain in an Interview)

When an interviewer asks you: *"Walk me through this project"*, follow this structured flow:

### 1. Elevator Pitch (30 Seconds)
> *"I built a full-stack quick-commerce application inspired by Blinkit using React with Vite on the frontend and Express.js on the backend. It features a complete grocery catalog, dynamic cart management, and an AI Shopping Concierge that supports both conversational text queries and visual photo searches for grocery items."*

---

### 2. Frontend Architecture (React + Vite)
- **Why Vite instead of Create React App?**  
  *Vite uses native ES modules during development and esbuild for pre-bundling, making server cold-starts and Hot Module Replacement (HMR) virtually instantaneous compared to Webpack.*
- **State Management**:  
  *Kept clean and beginner-friendly using standard React hooks (`useState`, `useEffect`). State is lifted to `App.jsx` for global access (cart items, active categories, search term) and passed down to modular components (`Navbar`, `ProductList`, `CartModal`, `AIChatDrawer`).*
- **Component Separation**:  
  *Divided into single-responsibility components: `ProductCard` handles local quantity interactions, `CartModal` handles checkout and delivery fee calculations, and `AIChatDrawer` handles AI interactions.*

---

### 3. Backend Architecture (Express.js)
- **Layered Architecture (Separation of Concerns)**:
  - **Routes (`routes/`)**: Defines RESTful endpoints (`/api/products`, `/api/chat`).
  - **Controllers (`controllers/`)**: Handles HTTP request parsing, status codes, and error formatting.
  - **Services (`services/`)**: Contains business logic (AI communication and search scoring algorithms).
- **CORS & Proxying**:  
  *Configured CORS on the Express server and a proxy in `vite.config.js` so frontend requests to `/api` route directly without cross-origin friction during development.*

---

### 4. How the AI Search Works (Multimodal + High Availability)
- **Multimodal Support**:  
  *Users can type natural language (e.g., "ingredients for paneer butter masala") or upload an image file. The browser converts the image to a Base64 string and sends it in the JSON payload to `POST /api/chat`.*
- **Fail-Safe / Graceful Degradation (Crucial for Interviews!)**:  
  *External AI APIs can hit rate limits or timeout. To solve this, I designed a multi-tier AI service: if cloud AI is available, it analyzes the request; if it's absent or times out, the backend seamlessly falls back to a smart local intent & keyword matcher. This ensures the demo never crashes.*

---

### 5. Common Interview Questions & Answers

**Q1: How does the AI match items for a query like "I want to make paneer butter masala"?**  
*Answer: The AI service identifies cooking intent and extracts key ingredient entities. It maps them against our catalog (Milky Mist Paneer, Amul Butter, Cumin seeds, Turmeric powder) and returns both a friendly recipe message and the product cards with their price and stock status.*

**Q2: How is the image sent from the browser to the backend?**  
*Answer: Using the browser's native `FileReader` API (`readAsDataURL`), the uploaded image file is encoded into a Base64 string and posted in `req.body.image`. Express is configured with `express.json({ limit: '50mb' })` to safely parse large image payloads.*

**Q3: How do you handle delivery fees in the cart?**  
*Answer: The cart computes total item value. If total is ₹199 or more, delivery is marked FREE (standard quick-commerce incentive). Otherwise, a ₹25 delivery fee is applied.*

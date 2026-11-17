const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getCategories,
  getProductById
} = require('../controllers/productController');

// 1. GET /api/products/categories -> Unique list of categories
router.get('/categories', getCategories);

// 2. GET /api/products -> All products (can filter by ?category= & ?search=)
router.get('/', getAllProducts);

// 3. GET /api/products/:id -> Single product details
router.get('/:id', getProductById);

module.exports = router;

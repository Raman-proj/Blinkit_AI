const fs = require('fs');
const path = require('path');

// Path to products.json
const productsFilePath = path.join(__dirname, '../data/products.json');

// Helper to load products safely
function loadProducts() {
  try {
    const rawData = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Failed to load products.json:', error.message);
    return [];
  }
}

let products = loadProducts();

/**
 * Controller: Get all products
 * Supports query params: ?category=Snacks&search=chips
 */
const getAllProducts = (req, res) => {
  try {
    const { category, search } = req.query;
    let result = [...products];

    // Filter by category if provided
    if (category && category.toLowerCase() !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search keyword in name or description
    if (search) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.desc.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    res.json(result);
  } catch (error) {
    console.error('Error in getAllProducts:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

/**
 * Controller: Get list of distinct product categories
 */
const getCategories = (req, res) => {
  try {
    const categorySet = new Set(products.map((p) => p.category));
    const categories = ['All', ...Array.from(categorySet)];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

/**
 * Controller: Get single product by ID
 */
const getProductById = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

module.exports = {
  getAllProducts,
  getCategories,
  getProductById,
  products
};

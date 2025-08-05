// Product data - This would typically come from an API or database
const productsData = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    category: "electronics",
    rating: 4.5,
    stock: 15,
    featured: true,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors. Made from 100% certified organic cotton.",
    category: "clothing",
    rating: 4.8,
    stock: 32,
    featured: true,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    name: "Smart Home Security Camera",
    price: 149.99,
    description: "HD security camera with motion detection, night vision, and smartphone app integration. Keep your home safe and secure.",
    category: "electronics",
    rating: 4.3,
    stock: 8,
    featured: false,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 4,
    name: "Yoga Mat Premium",
    price: 34.99,
    description: "Non-slip premium yoga mat made from eco-friendly materials. Perfect for yoga, pilates, and home workouts.",
    category: "sports",
    rating: 4.7,
    stock: 25,
    featured: true,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 5,
    name: "Stainless Steel Water Bottle",
    price: 19.99,
    description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.",
    category: "home",
    rating: 4.6,
    stock: 45,
    featured: false,
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 6,
    name: "JavaScript Programming Book",
    price: 39.99,
    description: "Comprehensive guide to modern JavaScript programming. Learn ES6+, async/await, and advanced concepts with practical examples.",
    category: "books",
    rating: 4.9,
    stock: 12,
    featured: true,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 7,
    name: "Wireless Phone Charger",
    price: 29.99,
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and over-charge protection.",
    category: "electronics",
    rating: 4.4,
    stock: 18,
    featured: false,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 8,
    name: "Running Shoes",
    price: 89.99,
    description: "Lightweight running shoes with advanced cushioning and breathable mesh upper. Perfect for daily runs and training.",
    category: "sports",
    rating: 4.5,
    stock: 0, // Out of stock
    featured: false,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 9,
    name: "LED Desk Lamp",
    price: 44.99,
    description: "Adjustable LED desk lamp with multiple brightness levels and color temperatures. USB charging port included.",
    category: "home",
    rating: 4.2,
    stock: 22,
    featured: false,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 10,
    name: "Bluetooth Speaker",
    price: 59.99,
    description: "Portable Bluetooth speaker with 360-degree sound and waterproof design. 20-hour battery life and built-in microphone.",
    category: "electronics",
    rating: 4.6,
    stock: 14,
    featured: true,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 11,
    name: "Denim Jacket",
    price: 64.99,
    description: "Classic denim jacket made from premium cotton denim. Timeless style that goes with everything in your wardrobe.",
    category: "clothing",
    rating: 4.4,
    stock: 28,
    featured: false,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 12,
    name: "Coffee Maker",
    price: 129.99,
    description: "Programmable drip coffee maker with thermal carafe. Brews perfect coffee every time with adjustable strength settings.",
    category: "home",
    rating: 4.7,
    stock: 6,
    featured: false,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 13,
    name: "Fitness Tracker",
    price: 99.99,
    description: "Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life. Track your health and fitness goals.",
    category: "sports",
    rating: 4.3,
    stock: 19,
    featured: true,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 14,
    name: "Cookbook Collection",
    price: 49.99,
    description: "Collection of 3 bestselling cookbooks featuring recipes from around the world. Perfect for home chefs and food enthusiasts.",
    category: "books",
    rating: 4.8,
    stock: 15,
    featured: false,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 15,
    name: "Wireless Mouse",
    price: 24.99,
    description: "Ergonomic wireless mouse with precision tracking and long battery life. Compatible with all operating systems.",
    category: "electronics",
    rating: 4.1,
    stock: 35,
    featured: false,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 16,
    name: "Hoodie Sweatshirt",
    price: 39.99,
    description: "Comfortable fleece hoodie sweatshirt perfect for casual wear. Soft fabric blend with kangaroo pocket and drawstring hood.",
    category: "clothing",
    rating: 4.6,
    stock: 24,
    featured: false,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 17,
    name: "Indoor Plant Set",
    price: 54.99,
    description: "Set of 3 low-maintenance indoor plants with decorative pots. Perfect for beginners and adds life to any space.",
    category: "home",
    rating: 4.5,
    stock: 11,
    featured: false,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 18,
    name: "Tennis Racket",
    price: 79.99,
    description: "Professional-grade tennis racket with carbon fiber frame. Lightweight design with excellent power and control.",
    category: "sports",
    rating: 4.4,
    stock: 7,
    featured: false,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 19,
    name: "Web Design Handbook",
    price: 34.99,
    description: "Complete guide to modern web design with HTML5, CSS3, and responsive design principles. Includes practical projects.",
    category: "books",
    rating: 4.7,
    stock: 20,
    featured: false,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 20,
    name: "Smartphone Stand",
    price: 14.99,
    description: "Adjustable smartphone stand with multiple viewing angles. Perfect for video calls, watching videos, and hands-free use.",
    category: "electronics",
    rating: 4.2,
    stock: 42,
    featured: false,
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  }
];

// Categories for filtering
const categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'books', label: 'Books' },
  { value: 'sports', label: 'Sports' }
];

// Sort options
const sortOptions = [
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'name', label: 'Name A-Z' }
];

// Function to get all products
function getAllProducts() {
  return productsData;
}

// Function to get featured products
function getFeaturedProducts() {
  return productsData.filter(product => product.featured);
}

// Function to get product by ID
function getProductById(id) {
  return productsData.find(product => product.id === parseInt(id));
}

// Function to filter products by category
function filterProductsByCategory(category) {
  if (!category) return productsData;
  return productsData.filter(product => product.category === category);
}

// Function to search products
function searchProducts(query) {
  if (!query) return productsData;
  
  const searchTerm = query.toLowerCase();
  return productsData.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
}

// Function to sort products
function sortProducts(products, sortBy) {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'rating':
      return sortedProducts.sort((a, b) => b.rating - a.rating);
    case 'name':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sortedProducts;
  }
}

// Function to check if product is in stock
function isProductInStock(productId) {
  const product = getProductById(productId);
  return product && product.stock > 0;
}

// Function to get product stock status
function getStockStatus(stock) {
  if (stock === 0) return 'out-of-stock';
  if (stock <= 5) return 'low-stock';
  return 'in-stock';
}

// Function to generate star rating HTML
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let starsHtml = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<span class="star">★</span>';
  }
  
  // Half star
  if (hasHalfStar) {
    starsHtml += '<span class="star">★</span>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<span class="star" style="opacity: 0.3;">★</span>';
  }
  
  return starsHtml;
}

// Function to format price
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

// Function to simulate API delay (for loading states)
function simulateApiDelay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Export functions for use in other modules (if using ES6 modules)
// Note: Since we're using vanilla JS without a build system, 
// these functions are available globally

// Mock API functions for future enhancement
const API = {
  // Simulate fetching products from server
  async fetchProducts() {
    await simulateApiDelay();
    return getAllProducts();
  },
  
  // Simulate fetching featured products
  async fetchFeaturedProducts() {
    await simulateApiDelay();
    return getFeaturedProducts();
  },
  
  // Simulate fetching single product
  async fetchProduct(id) {
    await simulateApiDelay();
    return getProductById(id);
  },
  
  // Simulate search API
  async searchProducts(query) {
    await simulateApiDelay();
    return searchProducts(query);
  }
};

// Sample review data for enhanced product details
const productReviews = {
  1: [
    { name: "John D.", rating: 5, comment: "Amazing sound quality and battery life!" },
    { name: "Sarah M.", rating: 4, comment: "Great headphones, very comfortable for long use." }
  ],
  2: [
    { name: "Mike R.", rating: 5, comment: "Super soft and fits perfectly!" },
    { name: "Lisa K.", rating: 5, comment: "Love the organic cotton material." }
  ],
  // Add more reviews as needed
};

// Function to get product reviews
function getProductReviews(productId) {
  return productReviews[productId] || [];
}

// Constants for UI
const UI_CONSTANTS = {
  ITEMS_PER_PAGE: 12,
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300
};

// Utility function to debounce search input
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Main Application Logic
class ShopZoneApp {
  constructor() {
    this.currentSection = 'home';
    this.currentProducts = [];
    this.filteredProducts = [];
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedSort = '';
    this.isInitialized = false;
    
    this.init();
  }

  // Initialize the application
  async init() {
    this.setupTheme();
    this.bindNavigationEvents();
    this.bindProductEvents();
    this.bindModalEvents();
    this.initializeSearch();
    this.setupMobileMenu();
    
    // Load initial data
    await this.loadFeaturedProducts();
    await this.loadAllProducts();
    
    // Show home section by default
    this.showSection('home');
    
    // Update cart count on initialization with longer delay
    setTimeout(() => {
      this.updateCartCount();
    }, 500);
    
    this.isInitialized = true;
  }
  
  // Check if user is authenticated for protected actions
  requireAuthentication(action = 'perform this action') {
    const token = localStorage.getItem('shopzone_token');
    const user = localStorage.getItem('shopzone_user');
    
    if (!token || !user) {
      // Show login modal with custom message
      this.showAuthRequiredModal(action);
      return false;
    }
    
    return true;
  }
  
  // Show authentication required modal for specific actions
  showAuthRequiredModal(action) {
    const modalHTML = `
      <div class="auth-required-overlay" id="authRequiredOverlay" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      ">
        <div class="auth-required-modal" style="
          background: var(--bg-card);
          border-radius: 12px;
          max-width: 400px;
          width: 90%;
          padding: 2rem;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-color);
          transform: translateY(20px);
          transition: transform 0.3s ease;
        ">
          <button onclick="app.closeAuthRequiredModal()" style="
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-secondary);
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
          ">&times;</button>
          
          <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">🔒 Login Required</h3>
          
          <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
            You need to sign in to <strong>${action}</strong>. Join ShopZone for a better shopping experience!
          </p>
          
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button onclick="app.closeAuthRequiredModal(); authManager.showLogin();" style="
              background: var(--primary-color);
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              transition: all 0.2s ease;
            ">
              Sign In
            </button>
            <button onclick="app.closeAuthRequiredModal(); authManager.showRegister();" style="
              background: var(--bg-tertiary);
              color: var(--text-primary);
              border: 1px solid var(--border-color);
              padding: 0.75rem 1.5rem;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              transition: all 0.2s ease;
            ">
              Sign Up
            </button>
          </div>
          
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 1rem;">
            Create an account to save your cart and track your orders
          </p>
        </div>
      </div>
    `;
    
    // Remove existing modal
    const existing = document.getElementById('authRequiredOverlay');
    if (existing) existing.remove();
    
    // Add modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show with animation
    setTimeout(() => {
      const overlay = document.getElementById('authRequiredOverlay');
      const modal = overlay.querySelector('.auth-required-modal');
      if (overlay && modal) {
        overlay.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
      }
    }, 10);
  }
  
  // Close authentication required modal
  closeAuthRequiredModal() {
    const overlay = document.getElementById('authRequiredOverlay');
    if (overlay) {
      overlay.style.opacity = '0';
      const modal = overlay.querySelector('.auth-required-modal');
      if (modal) {
        modal.style.transform = 'translateY(20px)';
      }
      setTimeout(() => overlay.remove(), 300);
    }
  }
  
  // Check if authentication is required
  checkAuthenticationRequired() {
    // Check if user is authenticated
    const token = localStorage.getItem('shopzone_token');
    const user = localStorage.getItem('shopzone_user');
    
    if (!token || !user) {
      // User not authenticated, show login modal
      setTimeout(() => {
        if (window.authManager) {
          authManager.showLogin();
        }
      }, 1000);
      
      // Hide main content until login
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.style.opacity = '0.3';
        mainContent.style.pointerEvents = 'none';
        
        // Show authentication required message
        const authRequiredMsg = document.createElement('div');
        authRequiredMsg.id = 'auth-required-message';
        authRequiredMsg.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--bg-card);
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          z-index: 999;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          border: 1px solid var(--border-color);
        `;
        authRequiredMsg.innerHTML = `
          <h3 style="color: var(--primary-color); margin-bottom: 1rem;">🔒 Login Required</h3>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Please sign in to access ShopZone</p>
          <button onclick="authManager.showLogin()" style="background: var(--primary-color); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600;">
            Sign In Now
          </button>
        `;
        document.body.appendChild(authRequiredMsg);
      }
      
      return false; // Authentication required, stop action
    }
    
    return true; // User is authenticated, continue with action
  }

  // Theme Management
  setupTheme() {
    const savedTheme = localStorage.getItem('shopzone-theme') || 'light';
    this.setTheme(savedTheme);
    
    // Bind desktop theme toggle (if exists)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Bind mobile theme toggle
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    if (mobileThemeToggle) {
      mobileThemeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('shopzone-theme', theme);
    
    // Update theme toggle icons (both desktop and mobile)
    const sunIcons = document.querySelectorAll('.sun-icon');
    const moonIcons = document.querySelectorAll('.moon-icon');
    const themeLabel = document.querySelector('.theme-label');
    
    if (sunIcons && moonIcons) {
      sunIcons.forEach(sunIcon => {
        moonIcons.forEach(moonIcon => {
          if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'inline';
          } else {
            sunIcon.style.display = 'inline';
            moonIcon.style.display = 'none';
          }
        });
      });
    }
    
    // Update mobile theme label
    if (themeLabel) {
      themeLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  // Mobile Menu Setup
  setupMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileUserIcon = document.getElementById('mobile-user-icon');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
      });
    }
    
    // Mobile user icon - show dropdown
    if (mobileUserIcon) {
      mobileUserIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('mobile-user-dropdown');
        
        // Always toggle dropdown for both authenticated and non-authenticated users
        if (dropdown) {
          dropdown.classList.toggle('show');
        }
      });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('mobile-user-dropdown');
      const userIcon = document.getElementById('mobile-user-icon');
      
      if (dropdown && userIcon && 
          !dropdown.contains(e.target) && 
          !userIcon.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
    
    // Close mobile menu when clicking on nav links
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (mobileToggle && navLinks) {
          mobileToggle.classList.remove('active');
          navLinks.classList.remove('active');
        }
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileToggle && navLinks && 
          !mobileToggle.contains(e.target) && 
          !navLinks.contains(e.target)) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileToggle && navLinks) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  // Navigation Management
  bindNavigationEvents() {
    // Navigation buttons
    document.getElementById('home-btn')?.addEventListener('click', () => this.showSection('home'));
    document.getElementById('products-btn')?.addEventListener('click', () => this.showSection('products'));
    document.getElementById('cart-btn')?.addEventListener('click', () => {
      // Check authentication before viewing cart
      if (!this.requireAuthentication('view your cart')) {
        return;
      }
      this.showSection('cart');
    });
    document.getElementById('shop-now-btn')?.addEventListener('click', () => this.showSection('products'));
    
    // Update active navigation state
    this.updateActiveNavigation();
  }

  showSection(sectionName) {
    // Show loading with short duration
    this.showLoading();
    
    // Hide all sections with fade out
    const sections = ['home-section', 'products-section', 'cart-section'];
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        section.classList.add('loading');
        setTimeout(() => {
          section.style.display = 'none';
          section.classList.remove('loading');
        }, 200);
      }
    });

    // Show target section with delay and animation
    setTimeout(() => {
      const targetSection = document.getElementById(`${sectionName}-section`);
      if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('entering');
        
        // Remove entering class after animation
        setTimeout(() => {
          targetSection.classList.remove('entering');
        }, 400);
        
        this.currentSection = sectionName;
      }

      // Update navigation and hide loading
      this.updateActiveNavigation();
      this.hideLoading();
      
      // Section-specific actions
      if (sectionName === 'cart') {
        // Force cart display with delay to ensure cartManager is ready
        setTimeout(() => {
          if (window.cartManager && window.cartManager.displayCartItems) {
            window.cartManager.displayCartItems();
          }
        }, 100);
      } else if (sectionName === 'products') {
        this.displayProducts(this.filteredProducts.length ? this.filteredProducts : this.currentProducts);
      }
      
      // Update cart count when showing any section
      this.updateCartCount();
    }, 300); // Short loading time
  }

  updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement && cartManager) {
      const count = cartManager.getCartItemCount();
      cartCountElement.textContent = count;
    }
  }

  updateActiveNavigation() {
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Add active class to current section button
    const activeBtn = document.getElementById(`${this.currentSection}-btn`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }

  // Product Loading and Display
  async loadFeaturedProducts() {
    try {
      this.showLoading(true);
      const featuredProducts = await API.fetchFeaturedProducts();
      this.displayFeaturedProducts(featuredProducts);
    } catch (error) {
      console.error('Error loading featured products:', error);
      this.showToast('Error loading featured products', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async loadAllProducts() {
    try {
      this.showLoading(true);
      this.currentProducts = await API.fetchProducts();
      this.filteredProducts = [...this.currentProducts];
      this.displayProducts(this.currentProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      this.showToast('Error loading products', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  displayFeaturedProducts(products) {
    const container = document.getElementById('featured-products');
    if (!container) return;

    container.innerHTML = products.map(product => this.generateProductCard(product)).join('');
    this.bindProductCardEvents(container);
  }

  displayProducts(products) {
    const container = document.getElementById('all-products');
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = `
        <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" style="margin: 0 auto 1rem; opacity: 0.5;">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
          </svg>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(product => this.generateProductCard(product)).join('');
    this.bindProductCardEvents(container);
  }

  generateProductCard(product) {
    const stockStatus = getStockStatus(product.stock);
    const isOutOfStock = product.stock === 0;
    
    return `
      <div class="product-card ${isOutOfStock ? 'out-of-stock' : ''}" data-product-id="${product.id}">
        ${stockStatus === 'out-of-stock' ? '<div class="stock-status out-of-stock">Out of Stock</div>' : ''}
        ${stockStatus === 'low-stock' ? '<div class="stock-status low-stock">Low Stock</div>' : ''}
        
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-price">${formatPrice(product.price)}</div>
          
          <div class="product-rating">
            <div class="stars">
              ${generateStarRating(product.rating)}
            </div>
            <span class="rating-text">(${product.rating})</span>
          </div>
          
          <div class="product-actions">
            <button class="btn ${isOutOfStock ? 'btn-secondary out-of-stock-btn' : 'btn-primary'} add-to-cart-btn" data-product-id="${product.id}" ${isOutOfStock ? 'disabled' : ''}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V19C17 19.6 16.6 20 16 20H8C7.4 20 7 19.6 7 19V13H17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button class="btn btn-outline btn-small view-details-btn" data-product-id="${product.id}">
              View Details
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Product Events
  bindProductEvents() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      const debouncedSearch = debounce((query) => {
        this.searchProducts(query);
      }, UI_CONSTANTS.DEBOUNCE_DELAY);
      
      searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
      });
    }

    // Sort functionality
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.selectedSort = e.target.value;
        this.applyFiltersAndSort();
      });
    }

    // Filter functionality
    const filterSelect = document.getElementById('filter-select');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.selectedCategory = e.target.value;
        this.applyFiltersAndSort();
      });
    }
  }

  bindProductCardEvents(container) {
    // Add to cart buttons
    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Check authentication before adding to cart
        if (!this.requireAuthentication('add items to cart')) {
          return;
        }
        
        const productId = parseInt(btn.dataset.productId);
        
        // Ensure cartManager is available
        if (window.cartManager && window.cartManager.addToCart) {
          const success = window.cartManager.addToCart(productId);
          if (success) {
            // Update cart count immediately
            this.updateCartCount();
          }
        } else {
          alert('Cart system not ready. Please refresh the page.');
        }
      });
    });

    // View details buttons
    container.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = parseInt(btn.dataset.productId);
        this.showProductModal(productId);
      });
    });

    // Product card click (show details)
    container.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        const productId = parseInt(card.dataset.productId);
        this.showProductModal(productId);
      });
    });
  }

  // Search and Filter Logic
  initializeSearch() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedSort = '';
  }

  searchProducts(query) {
    this.searchQuery = query.trim();
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort() {
    let products = [...this.currentProducts];

    // Apply search filter
    if (this.searchQuery) {
      products = searchProducts(this.searchQuery);
    }

    // Apply category filter
    if (this.selectedCategory) {
      products = products.filter(product => product.category === this.selectedCategory);
    }

    // Apply sorting
    if (this.selectedSort) {
      products = sortProducts(products, this.selectedSort);
    }

    this.filteredProducts = products;
    this.displayProducts(this.filteredProducts);
  }

  // Modal Management
  bindModalEvents() {
    const modal = document.getElementById('product-modal');
    const modalClose = document.getElementById('modal-close');

    if (modalClose) {
      modalClose.addEventListener('click', () => this.hideProductModal());
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideProductModal();
        }
      });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideProductModal();
      }
    });
  }

  showProductModal(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;

    const isOutOfStock = product.stock === 0;
    const stockStatus = getStockStatus(product.stock);

    modalBody.innerHTML = `
      <div class="modal-product-image">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--border-radius);">
      </div>
      <div class="modal-product-info">
        <h3>${product.name}</h3>
        <div class="modal-product-price">${formatPrice(product.price)}</div>
        
        <div class="product-rating">
          <div class="stars">
            ${generateStarRating(product.rating)}
          </div>
          <span class="rating-text">(${product.rating} stars)</span>
        </div>
        
        <div class="product-stock" style="margin: 1rem 0;">
          ${stockStatus === 'in-stock' ? `<span style="color: var(--success-color);">In Stock (${product.stock} available)</span>` : ''}
          ${stockStatus === 'low-stock' ? `<span style="color: var(--warning-color);">Low Stock (${product.stock} left)</span>` : ''}
          ${stockStatus === 'out-of-stock' ? `<span style="color: var(--error-color);">Out of Stock</span>` : ''}
        </div>
        
        <p class="modal-product-description">${product.description}</p>
        
        <div class="product-details" style="margin: 1.5rem 0;">
          <h4 style="margin-bottom: 0.5rem;">Product Details:</h4>
          <ul style="color: var(--text-secondary); line-height: 1.8;">
            <li>Category: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</li>
            <li>Rating: ${product.rating}/5.0</li>
            <li>Availability: ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</li>
          </ul>
        </div>
        
        <div class="modal-product-actions">
          <button class="btn btn-primary" id="modal-add-to-cart" ${isOutOfStock ? 'disabled' : ''}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V19C17 19.6 16.6 20 16 20H8C7.4 20 7 19.6 7 19V13H17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button class="btn btn-secondary" id="modal-close-btn">Close</button>
        </div>
      </div>
    `;

    // Bind modal-specific events
    const modalAddToCart = modalBody.querySelector('#modal-add-to-cart');
    if (modalAddToCart && !isOutOfStock) {
      modalAddToCart.addEventListener('click', () => {
        // Check authentication before adding to cart
        if (!this.requireAuthentication('add this item to cart')) {
          return;
        }
        
        if (window.cartManager) {
          window.cartManager.addToCart(productId);
          this.updateCartCount();
          this.hideProductModal();
        } else {
          console.warn('CartManager not initialized yet');
        }
      });
    }

    const modalCloseBtn = modalBody.querySelector('#modal-close-btn');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => this.hideProductModal());
    }

    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  hideProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = ''; // Restore scrolling
    }
  }

  // Utility Methods
  showLoading(show = true) {
    const loading = document.getElementById('loading');
    if (loading) {
      if (show) {
        loading.classList.remove('hidden');
      } else {
        loading.classList.add('hidden');
      }
    }
  }

  hideLoading() {
    this.showLoading(false);
  }

  showToast(message, type = 'success') {
    if (cartManager) {
      cartManager.showToast(message, type);
    }
  }

  // Public API for external access
  refreshProducts() {
    this.loadAllProducts();
  }

  getCurrentProducts() {
    return this.filteredProducts.length ? this.filteredProducts : this.currentProducts;
  }

  getProductById(id) {
    return getProductById(id);
  }

  // Show User Menu (for mobile)
  showUserMenu() {
    // This could show a dropdown or navigate to profile
    // For now, we'll just show the desktop user menu behavior
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
      userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
    }
  }
}

// Global App Instance
let app;
let cartManager;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart manager first
  if (typeof CartManager !== 'undefined') {
    cartManager = new CartManager();
    window.cartManager = cartManager;
  } else {
    console.error('CartManager class not found');
  }
  
  // Initialize main app
  app = new ShopZoneApp();
  
  // Make app globally accessible
  window.app = app;
  
  // Add some useful global functions
  window.showSection = (section) => app.showSection(section);
  window.addToCart = (productId, quantity = 1) => cartManager?.addToCart(productId, quantity);
  window.showProduct = (productId) => app.showProductModal(productId);
  
  // Direct add to cart function for onclick
  window.addToCartDirect = (productId) => {
    if (window.cartManager && window.cartManager.addToCart) {
      const success = window.cartManager.addToCart(productId);
      if (success && window.app) {
        window.app.updateCartCount();
      }
      return success;
    } else {
      return false;
    }
  };
});

// Handle page visibility changes (for potential data refresh)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && app) {
    // Optionally refresh data when page becomes visible
    // app.refreshProducts();
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  app?.showToast('Connection restored', 'success');
});

window.addEventListener('offline', () => {
  app?.showToast('Connection lost - working offline', 'warning');
});

// Footer Navigation Functions
function filterByCategory(category) {
  // Show products section
  app.showSection('products');
  
  // Set category filter
  const categorySelect = document.getElementById('category-filter');
  if (categorySelect) {
    categorySelect.value = category;
    
    // Trigger change event to filter products
    const event = new Event('change');
    categorySelect.dispatchEvent(event);
  }
  
  // Scroll to products section
  setTimeout(() => {
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
}

function showContactInfo() {
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  if (modalTitle) modalTitle.textContent = 'Contact Us';
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="padding: 1rem;">
        <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Get in Touch</h4>
        <div style="display: grid; gap: 1rem;">
          <div>
            <strong>Email:</strong>
            <p>support@shopzone.com</p>
          </div>
          <div>
            <strong>Phone:</strong>
            <p>+1 (555) 123-4567</p>
          </div>
          <div>
            <strong>Address:</strong>
            <p>123 Shopping Street<br>Commerce City, CC 12345</p>
          </div>
          <div>
            <strong>Business Hours:</strong>
            <p>Monday - Friday: 9:00 AM - 6:00 PM<br>Saturday: 10:00 AM - 4:00 PM<br>Sunday: Closed</p>
          </div>
        </div>
      </div>
    `;
  }
  
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.add('show');
}

function showShippingInfo() {
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  if (modalTitle) modalTitle.textContent = 'Shipping Information';
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="padding: 1rem;">
        <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Shipping Options</h4>
        <div style="display: grid; gap: 1.5rem;">
          <div>
            <h5>Standard Shipping (5-7 business days)</h5>
            <p>Free on orders over $50, otherwise $5.99</p>
          </div>
          <div>
            <h5>Express Shipping (2-3 business days)</h5>
            <p>$12.99</p>
          </div>
          <div>
            <h5>Next Day Delivery</h5>
            <p>$24.99 (Order by 2 PM)</p>
          </div>
          <div>
            <h5>International Shipping</h5>
            <p>Available to most countries. Rates calculated at checkout.</p>
          </div>
        </div>
      </div>
    `;
  }
  
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.add('show');
}

function showReturnsInfo() {
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  if (modalTitle) modalTitle.textContent = 'Returns & Exchanges';
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="padding: 1rem;">
        <h4 style="color: var(--primary-color); margin-bottom: 1rem;">Return Policy</h4>
        <div style="display: grid; gap: 1.5rem;">
          <div>
            <h5>30-Day Return Window</h5>
            <p>Items can be returned within 30 days of delivery for a full refund.</p>
          </div>
          <div>
            <h5>Return Conditions</h5>
            <ul style="margin-left: 1rem;">
              <li>Items must be unused and in original packaging</li>
              <li>All accessories and documentation must be included</li>
              <li>Return shipping is free for defective items</li>
            </ul>
          </div>
          <div>
            <h5>How to Return</h5>
            <ol style="margin-left: 1rem;">
              <li>Contact our support team</li>
              <li>Receive return authorization and label</li>
              <li>Package and ship your item</li>
              <li>Refund processed within 5-7 business days</li>
            </ol>
          </div>
        </div>
      </div>
    `;
  }
  
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.add('show');
}

function showFAQ() {
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  if (modalTitle) modalTitle.textContent = 'Frequently Asked Questions';
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="padding: 1rem;">
        <h4 style="color: var(--primary-color); margin-bottom: 1rem;">❓ FAQ</h4>
        <div style="display: grid; gap: 1.5rem;">
          <div>
            <h5>Q: How can I track my order?</h5>
            <p>A: Once your order ships, you'll receive a tracking number via email.</p>
          </div>
          <div>
            <h5>Q: Do you offer price matching?</h5>
            <p>A: Yes! We match prices from major competitors. Contact us with the details.</p>
          </div>
          <div>
            <h5>Q: What payment methods do you accept?</h5>
            <p>A: We accept all major credit cards, PayPal, Apple Pay, and Google Pay.</p>
          </div>
          <div>
            <h5>Q: How do I cancel my order?</h5>
            <p>A: Orders can be cancelled within 1 hour of placement. Contact support immediately.</p>
          </div>
          <div>
            <h5>Q: Do you have a physical store?</h5>
            <p>A: We're currently online-only, but we're planning to open physical locations soon!</p>
          </div>
        </div>
      </div>
    `;
  }
  
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.add('show');
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ShopZoneApp };
}

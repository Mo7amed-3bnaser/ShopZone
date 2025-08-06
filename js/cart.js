// Cart Management System
class CartManager {
  constructor() {
    this.cart = this.loadCartFromStorage();
    this.cartCountElement = document.getElementById('cart-count');
    this.init();
  }

  // Initialize cart system
  init() {
    this.updateCartCount();
    this.bindEvents();
  }
  
  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('shopzone_token');
    const user = localStorage.getItem('shopzone_user');
    return !!token && !!user;
  }

  // Load cart from localStorage
  loadCartFromStorage() {
    try {
      const savedCart = localStorage.getItem('shopzone-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return [];
    }
  }

  // Save cart to localStorage
  saveCartToStorage() {
    try {
      localStorage.setItem('shopzone-cart', JSON.stringify(this.cart));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
      this.showToast('Error saving cart', 'error');
    }
  }

  // Add item to cart
  addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    
    if (!product) {
      this.showToast('Product not found', 'error');
      return false;
    }

    if (!isProductInStock(productId)) {
      this.showToast('Product is out of stock', 'error');
      return false;
    }

    if (quantity <= 0) {
      this.showToast('Invalid quantity', 'error');
      return false;
    }

    // Check if product already exists in cart
    const existingItemIndex = this.cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      const newQuantity = this.cart[existingItemIndex].quantity + quantity;
      
      // Check stock availability
      if (newQuantity > product.stock) {
        this.showToast(`Only ${product.stock} items available`, 'warning');
        return false;
      }
      
      this.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      if (quantity > product.stock) {
        this.showToast(`Only ${product.stock} items available`, 'warning');
        return false;
      }
      
      this.cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image
      });
    }

    this.saveCartToStorage();
    this.updateCartCount();
    this.showToast(`${product.name} added to cart!`, 'success');
    
    // Update cart display if cart section is visible
    if (this.isCartSectionVisible()) {
      this.displayCartItems();
    }
    
    return true;
  }

  // Remove item from cart
  removeFromCart(productId) {
    const itemIndex = this.cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
      const removedItem = this.cart[itemIndex];
      this.cart.splice(itemIndex, 1);
      this.saveCartToStorage();
      this.updateCartCount();
      this.showToast(`${removedItem.name} removed from cart`, 'success');
      
      // Update cart display
      if (this.isCartSectionVisible()) {
        this.displayCartItems();
      }
      
      return true;
    }
    
    return false;
  }

  // Update item quantity in cart
  updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      return this.removeFromCart(productId);
    }

    const product = getProductById(productId);
    if (!product) {
      this.showToast('Product not found', 'error');
      return false;
    }

    if (newQuantity > product.stock) {
      this.showToast(`Only ${product.stock} items available`, 'warning');
      return false;
    }

    const itemIndex = this.cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
      this.cart[itemIndex].quantity = newQuantity;
      this.saveCartToStorage();
      this.updateCartCount();
      
      // Update cart display
      if (this.isCartSectionVisible()) {
        this.displayCartItems();
      }
      
      return true;
    }
    
    return false;
  }

  // Clear entire cart
  clearCart() {
    if (this.cart.length === 0) {
      this.showToast('Cart is already empty', 'info');
      return;
    }

    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to clear your cart?');
    
    if (confirmed) {
      this.cart = [];
      this.saveCartToStorage();
      this.updateCartCount();
      this.showToast('Cart cleared successfully', 'success');
      
      // Update cart display
      if (this.isCartSectionVisible()) {
        this.displayCartItems();
      }
    }
  }

  // Get cart items
  getCartItems() {
    return [...this.cart];
  }

  // Get cart total
  getCartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get cart item count
  getCartItemCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Update cart count display
  updateCartCount() {
    const count = this.getCartItemCount();
    if (this.cartCountElement) {
      this.cartCountElement.textContent = count;
    }
  }

  // Check if cart section is visible
  isCartSectionVisible() {
    const cartSection = document.getElementById('cart-section');
    return cartSection && cartSection.style.display !== 'none';
  }

  // Display cart items in the UI
  displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartContainer = document.getElementById('empty-cart');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsContainer || !emptyCartContainer || !cartTotalElement) {
      return;
    }

    if (this.cart.length === 0) {
      cartItemsContainer.style.display = 'none';
      emptyCartContainer.style.display = 'block';
      cartTotalElement.textContent = '0.00';
      return;
    }

    cartItemsContainer.style.display = 'block';
    emptyCartContainer.style.display = 'none';

    // Generate cart items HTML
    const cartItemsHTML = this.cart.map(item => {
      return `
        <div class="cart-item" data-product-id="${item.id}">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--border-radius);">
          </div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
          </div>
          <div class="quantity-controls">
            <button class="quantity-btn decrease-btn" data-product-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${getProductById(item.id)?.stock || 99}" data-product-id="${item.id}">
            <button class="quantity-btn increase-btn" data-product-id="${item.id}" ${item.quantity >= (getProductById(item.id)?.stock || 99) ? 'disabled' : ''}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <button class="remove-item-btn" data-product-id="${item.id}" title="Remove item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H5H21M8 6V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V6M19 6V20C19 20.6 18.6 21 18 21H6C5.4 21 5 20.6 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 11V17M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      `;
    }).join('');
    
    cartItemsContainer.innerHTML = cartItemsHTML;

    // Update total
    const total = this.getCartTotal().toFixed(2);
    cartTotalElement.textContent = total;

    // Bind cart item events
    this.bindCartItemEvents();
  }

  // Bind cart-specific events
  bindCartItemEvents() {
    // Quantity increase buttons
    document.querySelectorAll('.increase-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.currentTarget.dataset.productId);
        const currentQuantity = this.cart.find(item => item.id === productId)?.quantity || 0;
        this.updateQuantity(productId, currentQuantity + 1);
      });
    });

    // Quantity decrease buttons
    document.querySelectorAll('.decrease-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.currentTarget.dataset.productId);
        const currentQuantity = this.cart.find(item => item.id === productId)?.quantity || 0;
        this.updateQuantity(productId, currentQuantity - 1);
      });
    });

    // Quantity input fields
    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        const newQuantity = parseInt(e.target.value) || 1;
        this.updateQuantity(productId, newQuantity);
      });

      // Prevent invalid input
      input.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        const product = getProductById(parseInt(e.target.dataset.productId));
        const maxStock = product?.stock || 99;
        
        if (value < 1) {
          e.target.value = 1;
        } else if (value > maxStock) {
          e.target.value = maxStock;
        }
      });
    });

    // Remove item buttons
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.currentTarget.dataset.productId);
        this.removeFromCart(productId);
      });
    });
  }

  // Bind global cart events
  bindEvents() {
    // Clear cart button
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => this.clearCart());
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.handleCheckout());
    }

    // Continue shopping button
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener('click', () => {
        // Switch to products section
        window.app?.showSection('products');
      });
    }
  }

  // Handle checkout process
  handleCheckout() {
    // Check authentication before checkout
    if (!this.isAuthenticated()) {
      if (window.app && typeof window.app.requireAuthentication === 'function') {
        window.app.requireAuthentication('proceed to checkout');
      } else {
        this.showToast('Please sign in to checkout', 'error');
      }
      return;
    }
    
    if (this.cart.length === 0) {
      this.showToast('Your cart is empty', 'warning');
      return;
    }

    // Check stock availability for all items
    const unavailableItems = this.cart.filter(item => {
      const product = getProductById(item.id);
      return !product || product.stock < item.quantity;
    });

    if (unavailableItems.length > 0) {
      this.showToast('Some items are no longer available', 'error');
      return;
    }

    // Simulate checkout process
    const total = this.getCartTotal();
    const confirmed = confirm(`Proceed to checkout?\nTotal: ${formatPrice(total)}`);
    
    if (confirmed) {
      // Simulate checkout success
      this.showToast('Order placed successfully! Thank you for shopping with us.', 'success');
      
      // Clear cart after successful checkout
      setTimeout(() => {
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartCount();
        this.displayCartItems();
      }, 2000);
    }
  }

  // Show toast notification
  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    if (!toast || !toastMessage || !toastIcon) return;

    // Set message
    toastMessage.textContent = message;

    // Set icon based on type
    let iconHtml = '';
    switch (type) {
      case 'success':
        toast.style.backgroundColor = 'var(--success-color)';
        iconHtml = '<path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>';
        break;
      case 'error':
        toast.style.backgroundColor = 'var(--error-color)';
        iconHtml = '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        break;
      case 'warning':
        toast.style.backgroundColor = 'var(--warning-color)';
        iconHtml = '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 9V13M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        break;
      case 'info':
        toast.style.backgroundColor = 'var(--primary-color)';
        iconHtml = '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        break;
      default:
        toast.style.backgroundColor = 'var(--success-color)';
        iconHtml = '<path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>';
    }
    
    toastIcon.innerHTML = iconHtml;

    // Show toast
    toast.classList.add('show');

    // Hide toast after delay
    setTimeout(() => {
      toast.classList.remove('show');
    }, UI_CONSTANTS.TOAST_DURATION);
  }

  // Get cart summary for display
  getCartSummary() {
    return {
      items: this.cart,
      totalItems: this.getCartItemCount(),
      totalPrice: this.getCartTotal(),
      formattedTotal: formatPrice(this.getCartTotal())
    };
  }

  // Check if product is in cart
  isProductInCart(productId) {
    return this.cart.some(item => item.id === productId);
  }

  // Get quantity of specific product in cart
  getProductQuantityInCart(productId) {
    const item = this.cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }
}

// Export CartManager class for global access
if (typeof window !== 'undefined') {
  window.CartManager = CartManager;
}

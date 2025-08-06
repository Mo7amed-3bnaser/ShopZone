// Authentication Service for ShopZone
class AuthService {
  constructor() {
    // For demo/frontend-only mode without backend server
    this.isDemoMode = true; // Set to false when backend is ready
    
    // Detect if we're in production or development
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    this.baseURL = isProduction 
      ? `${window.location.origin}/api/auth`
      : 'http://localhost:5001/api/auth';
    this.token = localStorage.getItem('shopzone_token');
    this.user = JSON.parse(localStorage.getItem('shopzone_user') || 'null');
    
    // Demo users for frontend testing - now flexible, will be populated during registration
    this.demoUsers = [];
  }

  // Register new user
  async register(userData) {
    // Demo mode - simulate registration without backend
    if (this.isDemoMode) {
      return this.demoRegister(userData);
    }
    
    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.setAuthData(data.token, data.user);
        return { 
          success: true, 
          user: data.user, 
          message: `Welcome ${data.user.name}! Account created successfully!`
        };
      } else {
        // Return the actual error message from server
        return { success: false, message: data.message || 'Registration failed', errors: data.errors };
      }
    } catch (error) {
      console.error('Register error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { success: false, message: 'Unable to connect to server. Please check your connection.' };
      }
      
      return { success: false, message: 'Network error. Please try again.' };
    }
  }
  
  // Demo registration function for frontend testing
  demoRegister(userData) {
    const { name, email, password } = userData;
    
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { 
        success: false, 
        message: 'Please enter a valid email address' 
      };
    }
    
    if (!password || password.length < 3) {
      return { 
        success: false, 
        message: 'Password must be at least 3 characters long' 
      };
    }
    
    if (!name || name.trim().length < 2) {
      return { 
        success: false, 
        message: 'Name must be at least 2 characters long' 
      };
    }
    
    // Check if user already exists in demo users
    const existingUser = this.demoUsers.find(u => u.email === email);
    
    if (existingUser) {
      return { 
        success: false, 
        message: 'Email already registered. Try logging in instead.' 
      };
    }
    
    // Create new demo user
    const newUser = {
      id: Date.now(),
      email: email.trim(),
      password: password,
      name: name.trim()
    };
    
    this.demoUsers.push(newUser);
    
    // Generate a demo token
    const token = 'demo_token_' + Date.now();
    const userResponse = { id: newUser.id, email: newUser.email, name: newUser.name };
    
    this.setAuthData(token, userResponse);
    return { 
      success: true, 
      user: userResponse, 
      message: `Welcome ${userResponse.name}! Account created successfully!`
    };
  }

  // Login user
  async login(credentials) {
    // Demo mode - simulate login without backend
    if (this.isDemoMode) {
      return this.demoLogin(credentials);
    }
    
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.setAuthData(data.token, data.user);
        return { 
          success: true, 
          user: data.user, 
          message: `Welcome back ${data.user.name}! Login successful!`
        };
      } else {
        // Return the actual error message from server
        return { success: false, message: data.message || 'Authentication failed', errors: data.errors };
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { success: false, message: 'Unable to connect to server. Please check your connection and try again.' };
      }
      
      return { success: false, message: 'An unexpected error occurred. Please try again later.' };
    }
  }
  
  // Demo login function for frontend testing
  demoLogin(credentials) {
    const { email, password } = credentials;
    
    // Find matching demo user
    let user = this.demoUsers.find(u => u.email === email && u.password === password);
    
    // If user not found in demo users, check if it's a valid email and create a temporary user
    if (!user && email && password) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        // Create a temporary user for any valid email
        const tempUser = {
          id: Date.now(),
          email: email,
          password: password,
          name: email.split('@')[0] // Use the part before @ as name
        };
        
        // Add to demo users for future logins
        this.demoUsers.push(tempUser);
        user = tempUser;
      }
    }
    
    if (user) {
      // Generate a demo token
      const token = 'demo_token_' + Date.now();
      const userData = { id: user.id, email: user.email, name: user.name };
      
      this.setAuthData(token, userData);
      return { 
        success: true, 
        user: userData, 
        message: `Welcome back ${userData.name}! Login successful!`
      };
    } else {
      return { 
        success: false, 
        message: 'Please enter a valid email and password to continue'
      };
    }
  }

  // Get current user info
  async getCurrentUser() {
    if (!this.token) {
      return { success: false, message: 'No token found' };
    }

    try {
      const response = await fetch(`${this.baseURL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        this.user = data.user;
        localStorage.setItem('shopzone_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        this.logout();
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Get current user error:', error);
      this.logout();
      return { success: false, message: 'Failed to verify user' };
    }
  }

  // Logout user
  async logout() {
    try {
      await fetch(`${this.baseURL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Set authentication data
  setAuthData(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('shopzone_token', token);
    localStorage.setItem('shopzone_user', JSON.stringify(user));
    
    // Enable main app after successful authentication
    this.enableAppAfterLogin();
  }
  
  // Enable main application after successful login
  enableAppAfterLogin() {
    // Just update UI, no need to reinitialize app
    if (window.app) {
      window.app.updateCartCount();
    }
  }

  // Clear authentication data
  clearAuthData() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('shopzone_token');
    localStorage.removeItem('shopzone_user');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Get current user
  getUser() {
    return this.user;
  }

  // Get token
  getToken() {
    return this.token;
  }

  // Check if user has specific role
  hasRole(role) {
    return this.user && this.user.role === role;
  }

  // Format user display name
  getUserDisplayName() {
    if (!this.user) return 'Guest';
    return this.user.name || this.user.email || 'User';
  }
}

// Create global auth service instance
window.authService = new AuthService();

// Authentication Manager for UI
class AuthManager {
  constructor() {
    this.authService = window.authService || new AuthService();
    this.currentModal = null;
    this.init();
  }

  init() {
    // Check authentication status on page load
    this.checkAuthStatus();
    
    // Update UI based on auth status
    this.updateUI();
  }

  // Check if user is still authenticated
  async checkAuthStatus() {
    if (this.authService.isAuthenticated()) {
      const result = await this.authService.getCurrentUser();
      if (!result.success) {
        this.authService.logout();
        this.updateUI();
      }
    }
  }

  // Show login modal
  showLogin() {
    this.showAuthModal('login');
  }

  // Show register modal
  showRegister() {
    this.showAuthModal('register');
  }

  // Show authentication modal
  showAuthModal(type = 'login') {
    const modalHTML = `
      <div class="auth-modal-overlay" id="authModalOverlay">
        <div class="auth-modal">
          <div class="auth-modal-header">
            <h2 id="authModalTitle">${type === 'login' ? 'Sign In' : 'Create Account'}</h2>
            <button class="auth-modal-close" onclick="authManager.closeModal()">&times;</button>
          </div>
          
          <div class="auth-modal-body">
            <form id="authForm" class="auth-form">
              ${type === 'register' ? `
                <div class="form-group" data-field="name">
                  <label for="name">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Full Name
                  </label>
                  <input type="text" id="name" name="name" placeholder="Enter your full name" required>
                  <span class="error-message" id="nameError"></span>
                </div>
              ` : ''}
              
              <div class="form-group" data-field="email">
                <label for="email">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email Address
                </label>
                <input type="email" id="email" name="email" placeholder="Enter your email address" required>
                <span class="error-message" id="emailError"></span>
              </div>
              
              <div class="form-group" data-field="password">
                <label for="password">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"/>
                  </svg>
                  Password
                </label>
                <input type="password" id="password" name="password" placeholder="Enter your password" required>
                <span class="error-message" id="passwordError"></span>
              </div>
              
              <button type="submit" class="auth-submit-btn" id="authSubmitBtn">
                ${type === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            
            <div class="auth-switch">
              ${type === 'login' ? 
                `<p>Don't have an account? <a href="#" onclick="authManager.switchToRegister()">Sign up here</a></p>` :
                `<p>Already have an account? <a href="#" onclick="authManager.switchToLogin()">Sign in here</a></p>`
              }
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal
    const existingModal = document.getElementById('authModalOverlay');
    if (existingModal) {
      existingModal.remove();
    }

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    this.attachModalEventListeners(type);
    
    // Show modal
    document.getElementById('authModalOverlay').classList.add('show');
    this.currentModal = type;
  }

  // Attach event listeners to modal
  attachModalEventListeners(type) {
    const form = document.getElementById('authForm');
    const overlay = document.getElementById('authModalOverlay');

    // Form submission
    form.addEventListener('submit', (e) => this.handleFormSubmit(e, type));

    // Close modal on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeModal();
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  // Handle form submission
  async handleFormSubmit(e, type) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('authSubmitBtn');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Clear previous errors
    this.clearErrors();

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = type === 'login' ? 'Signing in...' : 'Creating account...';

    try {
      let result;
      
      if (type === 'login') {
        result = await this.authService.login(data);
      } else {
        result = await this.authService.register(data);
      }

      if (result.success) {
        if (type === 'login') {
          this.showToast(`Welcome back ${result.user.name}! Login successful! 🎉`, 'success');
        } else {
          this.showToast(`Welcome ${result.user.name}! Account created successfully! 🎊`, 'success');
        }
        this.closeModal();
        this.updateUI();
        
        // Close any authentication required modal
        if (window.app && typeof window.app.closeAuthRequiredModal === 'function') {
          window.app.closeAuthRequiredModal();
        }
        
        // Redirect or refresh cart data
        if (window.cartManager && typeof window.cartManager.syncCartWithUser === 'function') {
          window.cartManager.syncCartWithUser();
        }
      } else {
        if (result.errors) {
          this.showFieldErrors(result.errors);
        } else {
          // Show the actual error message from the server
          this.showToast(result.message || 'Authentication failed. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      // Show a more user-friendly message
      this.showToast('Network error. Please check your connection.', 'error');
    } finally {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = type === 'login' ? 'Sign In' : 'Create Account';
    }
  }

  // Show field-specific errors
  showFieldErrors(errors) {
    errors.forEach(error => {
      const field = error.path || error.param;
      const errorElement = document.getElementById(`${field}Error`);
      if (errorElement) {
        errorElement.textContent = error.msg;
        errorElement.style.display = 'block';
      }
    });
  }

  // Clear all error messages
  clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
      element.textContent = '';
      element.style.display = 'none';
    });
  }

  // Switch to register modal
  switchToRegister() {
    this.closeMobileDropdown();
    this.closeModal();
    this.showAuthModal('register');
  }

  // Switch to login modal
  switchToLogin() {
    this.closeMobileDropdown();
    this.closeModal();
    this.showAuthModal('login');
  }

  // Show login modal
  showLogin() {
    this.closeMobileDropdown();
    this.showAuthModal('login');
  }

  // Show register modal
  showRegister() {
    this.closeMobileDropdown();
    this.showAuthModal('register');
  }

  // Show Profile Page
  showProfile() {
    this.closeMobileDropdown();
    this.closeUserMenu();
    this.showProfileModal();
  }

  // Show Orders Page
  showOrders() {
    this.closeMobileDropdown();
    this.closeUserMenu();
    this.showOrdersModal();
  }

  // Show Settings Page
  showSettings() {
    this.closeMobileDropdown();
    this.closeUserMenu();
    this.showSettingsModal();
  }

  // Close user menu
  closeUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
      userMenu.classList.remove('active');
    }
  }

  // Close mobile dropdown
  closeMobileDropdown() {
    const dropdown = document.getElementById('mobile-user-dropdown');
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }

  // Close modal
  closeModal() {
    const modal = document.getElementById('authModalOverlay');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
    this.currentModal = null;
  }

  // Update UI based on authentication status
  updateUI() {
    const isAuthenticated = this.authService.isAuthenticated();
    const user = this.authService.getUser();

    // Update desktop navigation
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userMenu = document.getElementById('userMenu');

    // Update mobile navigation
    const mobileUserDropdown = document.getElementById('mobile-user-dropdown');

    if (isAuthenticated && user) {
      // Hide desktop login/register buttons
      if (loginBtn) loginBtn.style.display = 'none';
      if (registerBtn) registerBtn.style.display = 'none';

      // Show desktop user menu
      if (userMenu) {
        userMenu.style.display = 'block';
        const userName = userMenu.querySelector('.user-name');
        
        if (userName) userName.textContent = this.authService.getUserDisplayName();
      }

      // Update mobile user dropdown for authenticated users
      if (mobileUserDropdown) {
        mobileUserDropdown.innerHTML = `
          <div class="user-dropdown-item" style="background: var(--bg-secondary); pointer-events: none; padding: 12px 16px; border-bottom: 1px solid var(--border-color);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <strong>${this.authService.getUserDisplayName()}</strong>
          </div>
          <button class="user-dropdown-item" onclick="authManager.showProfile()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
            Profile
          </button>
          <button class="user-dropdown-item" onclick="authManager.showOrders()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
              <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
            </svg>
            My Orders
          </button>
          <button class="user-dropdown-item" onclick="authManager.showSettings()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2569 9.77251 19.9859C9.5799 19.7148 9.31074 19.5062 9 19.38C8.69838 19.2469 8.36381 19.2072 8.03941 19.266C7.71502 19.3248 7.41568 19.4795 7.18 19.71L7.12 19.77C6.93425 19.956 6.71368 20.1035 6.47088 20.2041C6.22808 20.3048 5.96783 20.3566 5.705 20.3566C5.44217 20.3566 5.18192 20.3048 4.93912 20.2041C4.69632 20.1035 4.47575 19.956 4.29 19.77C4.10405 19.5843 3.95653 19.3637 3.85588 19.1209C3.75523 18.8781 3.70343 18.6178 3.70343 18.355C3.70343 18.0922 3.75523 17.8319 3.85588 17.5891C3.95653 17.3463 4.10405 17.1257 4.29 16.94L4.35 16.88C4.58054 16.6443 4.73519 16.345 4.794 16.0206C4.85282 15.6962 4.81312 15.3616 4.68 15.06C4.55324 14.7642 4.34276 14.512 4.07447 14.3343C3.80618 14.1566 3.49179 14.0613 3.17 14.06H3C2.46957 14.06 1.96086 13.8493 1.58579 13.4742C1.21071 13.0991 1 12.5904 1 12.06C1 11.5296 1.21071 11.0209 1.58579 10.6458C1.96086 10.2707 2.46957 10.06 3 10.06H3.09C3.42099 10.0523 3.742 9.94512 4.01309 9.75251C4.28417 9.5599 4.49279 9.29074 4.62 8.98C4.75312 8.67838 4.79282 8.34381 4.734 8.01941C4.67519 7.69502 4.52054 7.39568 4.29 7.16L4.23 7.1C4.04405 6.91425 3.89653 6.69368 3.79588 6.45088C3.69523 6.20808 3.64343 5.94783 3.64343 5.685C3.64343 5.42217 3.69523 5.16192 3.79588 4.91912C3.89653 4.67632 4.04405 4.45575 4.23 4.27C4.41575 4.08405 4.63632 3.93653 4.87912 3.83588C5.12192 3.73523 5.38217 3.68343 5.645 3.68343C5.90783 3.68343 6.16808 3.73523 6.41088 3.83588C6.65368 3.93653 6.87425 4.08405 7.06 4.27L7.12 4.33C7.35568 4.56054 7.65502 4.71519 7.97941 4.774C8.30381 4.83282 8.63838 4.79312 8.94 4.66C9.23579 4.53324 9.48797 4.32276 9.66569 4.05447C9.84342 3.78618 9.93871 3.47179 9.94 3.15V3C9.94 2.46957 10.1507 1.96086 10.5258 1.58579C10.9009 1.21071 11.4096 1 11.94 1C12.4704 1 12.9791 1.21071 13.3542 1.58579C13.7293 1.96086 13.94 2.46957 13.94 3V3.09C13.9413 3.41179 14.0366 3.72618 14.2143 3.99447C14.392 4.26276 14.6442 4.47324 14.94 4.6C15.2416 4.73312 15.5762 4.77282 15.9006 4.714C16.225 4.65519 16.5243 4.50054 16.76 4.27L16.82 4.21C17.0057 4.02405 17.2263 3.87653 17.4691 3.77588C17.7119 3.67523 17.9722 3.62343 18.235 3.62343C18.4978 3.62343 18.7581 3.67523 19.0009 3.77588C19.2437 3.87653 19.4643 4.02405 19.65 4.21C19.836 4.39575 19.9835 4.61632 20.0841 4.85912C20.1848 5.10192 20.2366 5.36217 20.2366 5.625C20.2366 5.88783 20.1848 6.14808 20.0841 6.39088C19.9835 6.63368 19.836 6.85425 19.65 7.04L19.59 7.1C19.3595 7.33568 19.2048 7.63502 19.146 7.95941C19.0872 8.28381 19.1269 8.61838 19.26 8.92C19.3868 9.21579 19.5972 9.46797 19.8655 9.64569C20.1338 9.82342 20.4482 9.91871 20.77 9.92H20.83C21.3604 9.92 21.8691 10.1307 22.2442 10.5058C22.6193 10.8809 22.83 11.3896 22.83 11.92C22.83 12.4504 22.6193 12.9591 22.2442 13.3342C21.8691 13.7093 21.3604 13.92 20.83 13.92H20.74C20.4182 13.9213 20.1038 14.0166 19.8355 14.1943C19.5672 14.372 19.3567 14.6242 19.23 14.92C19.0969 15.2216 19.0572 15.5562 19.116 15.8806C19.1748 16.205 19.3295 16.5043 19.56 16.74L19.62 16.8C19.806 16.9857 19.9535 17.2063 20.0541 17.4491C20.1548 17.6919 20.2066 17.9522 20.2066 18.215C20.2066 18.4778 20.1548 18.7381 20.0541 18.9809C19.9535 19.2237 19.806 19.4443 19.62 19.63C19.4343 19.816 19.2137 19.9635 18.9709 20.0641C18.7281 20.1648 18.4678 20.2166 18.205 20.2166C17.9422 20.2166 17.6819 20.1648 17.4391 20.0641C17.1963 19.9635 16.9757 19.816 16.79 19.63L16.73 19.57C16.4943 19.3395 16.195 19.1848 15.8706 19.126C15.5462 19.0672 15.2116 19.1069 14.91 19.24C14.6142 19.3668 14.362 19.5772 14.1843 19.8455C14.0066 20.1138 13.9113 20.4282 13.91 20.75V20.83C13.91 21.3604 13.6993 21.8691 13.3242 22.2442C12.9491 22.6193 12.4404 22.83 11.91 22.83C11.3796 22.83 10.8709 22.6193 10.4958 22.2442C10.1207 21.8691 9.91 21.3604 9.91 20.83V20.74C9.90871 20.4182 9.81342 20.1038 9.63569 19.8355C9.45797 19.5672 9.20579 19.3567 8.91 19.23C8.60838 19.0969 8.27381 19.0572 7.94941 19.116C7.62502 19.1748 7.32568 19.3295 7.09 19.56L7.03 19.62C6.84425 19.806 6.62368 19.9535 6.38088 20.0541C6.13808 20.1548 5.87783 20.2066 5.615 20.2066C5.35217 20.2066 5.09192 20.1548 4.84912 20.0541C4.60632 19.9535 4.38575 19.806 4.2 19.62C4.01405 19.4343 3.86653 19.2137 3.76588 18.9709C3.66523 18.7281 3.61343 18.4678 3.61343 18.205C3.61343 17.9422 3.66523 17.6819 3.76588 17.4391C3.86653 17.1963 4.01405 16.9757 4.2 16.79L4.26 16.73C4.49054 16.4943 4.64519 16.195 4.704 15.8706C4.76282 15.5462 4.72312 15.2116 4.59 14.91C4.46324 14.6142 4.25276 14.362 3.98447 14.1843C3.71618 14.0066 3.40179 13.9113 3.08 13.91H3C2.46957 13.91 1.96086 13.6993 1.58579 13.3242C1.21071 12.9491 1 12.4404 1 11.91C1 11.3796 1.21071 10.8709 1.58579 10.4958C1.96086 10.1207 2.46957 9.91 3 9.91H3.09C3.41179 9.90871 3.72618 9.81342 3.99447 9.63569C4.26276 9.45797 4.47324 9.20579 4.6 8.91C4.73312 8.60838 4.77282 8.27381 4.714 7.94941C4.65519 7.62502 4.50054 7.32568 4.27 7.09L4.21 7.03C4.02405 6.84425 3.87653 6.62368 3.77588 6.38088C3.67523 6.13808 3.62343 5.87783 3.62343 5.615C3.62343 5.35217 3.67523 5.09192 3.77588 4.84912C3.87653 4.60632 4.02405 4.38575 4.21 4.2C4.39575 4.01405 4.61632 3.86653 4.85912 3.76588C5.10192 3.66523 5.36217 3.61343 5.625 3.61343C5.88783 3.61343 6.14808 3.66523 6.39088 3.76588C6.63368 3.87653 6.85425 4.02405 7.04 4.2L7.1 4.26C7.33568 4.49054 7.63502 4.64519 7.95941 4.704C8.28381 4.76282 8.61838 4.72312 8.92 4.59C9.21579 4.46324 9.46797 4.25276 9.64569 3.98447C9.82342 3.71618 9.91871 3.40179 9.92 3.08V3C9.92 2.46957 10.1307 1.96086 10.5058 1.58579C10.8809 1.21071 11.3896 1 11.92 1C12.4504 1 12.9591 1.21071 13.3342 1.58579C13.7093 1.96086 13.92 2.46957 13.92 3V3.08C13.9213 3.40179 14.0166 3.71618 14.1943 3.98447C14.372 4.25276 14.6242 4.46324 14.92 4.59C15.2216 4.72312 15.5562 4.76282 15.8806 4.704C16.205 4.64519 16.5043 4.49054 16.74 4.26L16.8 4.2C16.9857 4.01405 17.2063 3.86653 17.4491 3.76588C17.6919 3.66523 17.9522 3.61343 18.215 3.61343C18.4778 3.61343 18.7381 3.66523 18.9809 3.76588C19.2237 3.87653 19.4443 4.01405 19.63 4.2C19.816 4.38575 19.9635 4.60632 20.0641 4.84912C20.1648 5.09192 20.2166 5.35217 20.2166 5.615C20.2166 5.87783 20.1648 6.14808 20.0641 6.39088C19.9635 6.63368 19.816 6.85425 19.63 7.04L19.57 7.1C19.3395 7.33568 19.1848 7.63502 19.126 7.95941C19.0672 8.28381 19.1069 8.61838 19.24 8.92C19.3668 9.21579 19.5772 9.46797 19.8455 9.64569C20.1138 9.82342 20.4282 9.91871 20.75 9.92H20.83C21.3604 9.92 21.8691 10.1307 22.2442 10.5058C22.6193 10.8809 22.83 11.3896 22.83 11.92C22.83 12.4504 22.6193 12.9591 22.2442 13.3342C21.8691 13.7093 21.3604 13.92 20.83 13.92H20.74C20.4182 13.9213 20.1038 14.0166 19.8355 14.1943C19.5672 14.372 19.3567 14.6242 19.23 14.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Settings
          </button>
          <button class="user-dropdown-item" onclick="authManager.logout()" style="color: var(--error-color); border-top: 1px solid var(--border-color);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Logout
          </button>
        `;
      }
    } else {
      // Show desktop login/register buttons
      if (loginBtn) loginBtn.style.display = 'block';
      if (registerBtn) registerBtn.style.display = 'block';

      // Hide desktop user menu
      if (userMenu) userMenu.style.display = 'none';

      // Update mobile user dropdown for guest users
      if (mobileUserDropdown) {
        mobileUserDropdown.innerHTML = `
          <button class="user-dropdown-item" onclick="authManager.showLogin()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 17L15 12L10 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Login
          </button>
          <button class="user-dropdown-item mobile-signup" onclick="authManager.showRegister()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M16 21V19C16 16.7909 14.2091 15 12 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M20 8V14M23 11H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Sign Up
          </button>
        `;
      }
    }
  }

  // Logout user
  async logout() {
    try {
      this.closeMobileDropdown();
      await this.authService.logout();
      this.showToast('Logged out successfully', 'info');
      this.updateUI();
      
      // Clear cart data if needed
      if (window.cartManager && typeof window.cartManager.clearUserCart === 'function') {
        window.cartManager.clearUserCart();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Don't show error message for logout, just complete the logout
      this.authService.clearAuthData();
      this.updateUI();
      this.showToast('Logged out successfully', 'info');
    }
  }

  // Show toast notification
  showToast(message, type = 'info') {
    // Create a simple toast that definitely works
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 9999;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      max-width: 300px;
      animation: slideInFromTop 0.3s ease-out;
    `;
    
    toast.textContent = message;
    
    // Add CSS animation inline
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInFromTop {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    // Remove existing toast
    const existing = document.querySelector('[data-toast="true"]');
    if (existing) existing.remove();
    
    // Add toast
    toast.setAttribute('data-toast', 'true');
    document.body.appendChild(toast);
    
    // Remove after 4 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'slideInFromTop 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
    
    // Click to dismiss
    toast.addEventListener('click', () => {
      toast.style.animation = 'slideInFromTop 0.3s ease-out reverse';
      setTimeout(() => toast.remove(), 300);
    });
    
    // Auto remove after 5 seconds with fade
    setTimeout(() => {
      toast.style.transition = 'all 0.5s ease-out';
      toast.style.transform = toast.style.transform.replace('scale(1)', 'scale(0.8)');
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 500);
    }, 5000);
    
    // Add click to dismiss
    toast.addEventListener('click', () => {
      toast.style.transition = 'all 0.3s ease-out';
      toast.style.transform = toast.style.transform.replace('scale(1)', 'scale(0.9)');
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    });
  }

  // Show Profile Modal
  showProfileModal() {
    const user = this.authService.getUser();
    if (!user) return;

    const modalHTML = `
      <div class="modal-overlay" id="profileModalOverlay">
        <div class="modal-container profile-modal">
          <div class="modal-header">
            <h2>👤 Profile</h2>
            <button class="modal-close" onclick="authManager.closeProfileModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="profile-info">
              <div class="profile-avatar">
                <div class="user-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                    <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <div class="profile-details">
                <div class="form-group">
                  <label>Name</label>
                  <input type="text" value="${user.name}" readonly>
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" value="${user.email}" readonly>
                </div>
                <div class="form-group">
                  <label>Role</label>
                  <input type="text" value="${user.role || 'User'}" readonly>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('profileModalOverlay').classList.add('show');
  }

  // Show Orders Modal
  showOrdersModal() {
    const modalHTML = `
      <div class="modal-overlay" id="ordersModalOverlay">
        <div class="modal-container orders-modal">
          <div class="modal-header">
            <h2>📦 My Orders</h2>
            <button class="modal-close" onclick="authManager.closeOrdersModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="orders-list">
              <div class="order-item">
                <div class="order-header">
                  <span class="order-id">#ORD-001</span>
                  <span class="order-status pending">Processing</span>
                </div>
                <div class="order-total">Total: $99.99</div>
              </div>
              <div class="order-item">
                <div class="order-header">
                  <span class="order-id">#ORD-002</span>
                  <span class="order-status completed">Completed</span>
                </div>
                <div class="order-total">Total: $79.99</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('ordersModalOverlay').classList.add('show');
  }

  // Show Settings Modal
  showSettingsModal() {
    const modalHTML = `
      <div class="modal-overlay" id="settingsModalOverlay">
        <div class="modal-container settings-modal">
          <div class="modal-header">
            <h2>Settings</h2>
            <button class="modal-close" onclick="authManager.closeSettingsModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="settings-section">
              <h3>Language & Region</h3>
              <div class="setting-item">
                <label>Language: English</label>
              </div>
            </div>
            <div class="settings-section">
              <h3>Notifications</h3>
              <div class="setting-item">
                <label><input type="checkbox" checked> Promotional notifications</label>
              </div>
            </div>
            <div class="settings-section">
              <h3>Appearance</h3>
              <div class="setting-item">
                <select>
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('settingsModalOverlay').classList.add('show');
  }

  // Close modals
  closeProfileModal() {
    const modal = document.getElementById('profileModalOverlay');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  }

  closeOrdersModal() {
    const modal = document.getElementById('ordersModalOverlay');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  }

  closeSettingsModal() {
    const modal = document.getElementById('settingsModalOverlay');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  }
}

// Initialize auth manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.authManager = new AuthManager();
});

# ShopZone - Complete E-commerce Platform

A professional full-stack e-commerce website with user authentication, MongoDB database integration, and responsive design. Built with Node.js backend and vanilla JavaScript frontend.

## 🎯 Key Features

### 🔐 Authentication System

- **User Registration & Login**: Secure user accounts with JWT tokens
- **Password Hashing**: bcrypt encryption for user security
- **Session Management**: Persistent login with localStorage
- **User Profiles**: Profile management with user information
- **Order History**: View past orders and transaction history
- **Settings Panel**: User preferences and account settings

### 🎨 User Interface

- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Light/Dark Mode**: Theme toggle with localStorage persistence
- **Mobile-First Design**: Touch-friendly interface for mobile devices
- **User Avatar System**: Icon-based user representation (no images)
- **Toast Notifications**: Success/error messages positioned top-right
- **Modal System**: Clean modals for authentication and user actions

### 🛒 E-commerce Features

- **Product Catalog**: Dynamic product loading and display
- **Search & Filter**: Real-time search with category and price filtering
- **Shopping Cart**: Full cart management with localStorage persistence
- **Product Details**: Modal view with detailed product information
- **Stock Management**: Real-time stock tracking and indicators
- **Quantity Controls**: Increase/decrease quantities with validation

### 💾 Database Integration

- **MongoDB Atlas**: Cloud database for scalability
- **User Data**: Secure storage of user accounts and profiles
- **Order Management**: Track orders and purchase history
- **Product Data**: Centralized product information management
- **Session Storage**: Secure token-based authentication

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB Atlas Account** (free tier available)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or download** this project to your local machine
2. **Navigate** to the project directory
3. **Install dependencies**:

```bash
npm install
```

4. **Set up MongoDB Atlas**:

   - Create a free MongoDB Atlas account at https://cloud.mongodb.com
   - Create a new cluster
   - Get your connection string
   - Update the connection string in `server-atlas.js`

5. **Start the server**:

```bash
node server-atlas.js
```

6. **Open your browser** and navigate to `http://localhost:5001`

### Development Mode

For development with auto-reload:

```bash
# Install nodemon globally
npm install -g nodemon

# Run with nodemon
nodemon server-atlas.js
```

## 📁 Project Structure

```
ShopZone/
├── index.html              # Main HTML file
├── style.css               # All CSS styles and responsive design
├── README.md               # Project documentation
├── server-atlas.js         # Node.js Express server with MongoDB Atlas
├── package.json            # Node.js dependencies and scripts
├── js/                     # Frontend JavaScript modules
│   ├── auth.js            # Authentication service and UI management
│   ├── data.js            # Product data and utility functions
│   ├── cart.js            # Shopping cart management
│   └── main.js            # Main application logic and navigation
└── node_modules/           # Node.js dependencies (auto-generated)
```

## 🔧 Backend Architecture

### Server Features

- **Express.js**: Fast web framework for Node.js
- **MongoDB Atlas**: Cloud database with native driver
- **bcrypt**: Password hashing for security
- **JWT**: JSON Web Tokens for authentication
- **CORS**: Cross-origin resource sharing enabled
- **RESTful API**: Clean API endpoints for frontend communication

### API Endpoints

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

#### User Management

- User profiles with name, email, and role
- Secure password storage with bcrypt
- JWT token-based session management

## 🎨 Customization

### Themes

The application supports light and dark themes with complete UI consistency. Customize colors by modifying CSS variables in `style.css`:

```css
:root {
  --primary-color: #2563eb; /* Main brand color */
  --accent-color: #f59e0b; /* Accent/highlight color */
  --success-color: #10b981; /* Success messages */
  --error-color: #ef4444; /* Error messages */
  --bg-color: #ffffff; /* Background color */
  --text-primary: #1f2937; /* Primary text */
  /* ... more variables */
}
```

### User Interface Elements

- **User Avatars**: Icon-based system with gradient backgrounds
- **Navigation**: Responsive mobile/desktop navigation
- **Modals**: Authentication, profile, orders, and settings
- **Toast Notifications**: Top-right positioned with smooth animations
- **Mobile Dropdown**: User menu for mobile devices

### Database Configuration

Update MongoDB connection in `server-atlas.js`:

```javascript
const uri = "your-mongodb-atlas-connection-string";
```

### Products

Add or modify products in `js/data.js`:

```javascript
{
  id: 21,
  name: "Your Product Name",
  price: 29.99,
  description: "Product description...",
  category: "electronics",
  rating: 4.5,
  stock: 15,
  featured: true,
  emoji: "🎮"
}
```

### Styling

- **Colors**: Modify CSS variables in `:root` selector
- **Fonts**: Change the font-family in the `body` selector
- **Layout**: Adjust grid and flexbox properties
- **Animations**: Modify transition and animation properties

## 🛠️ Technical Details

### Frontend Architecture

- **`auth.js`**: AuthService and AuthManager classes for user authentication
- **`data.js`**: Product data, filtering, and utility functions
- **`cart.js`**: CartManager class handling all cart operations
- **`main.js`**: ShopZoneApp class managing UI and navigation

### Backend Architecture

- **Express.js Server**: RESTful API with middleware
- **MongoDB Atlas**: Cloud database with connection pooling
- **JWT Authentication**: Secure token-based user sessions
- **bcrypt Hashing**: Password security with salt rounds

### CSS Architecture

- **CSS Variables**: Centralized theme management
- **Responsive Design**: Mobile-first approach with breakpoints
- **Flexbox/Grid**: Modern layout techniques
- **Component-Based**: Modular CSS classes
- **Animation System**: Smooth transitions and hover effects

### Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure session management
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured cross-origin resource sharing
- **Error Handling**: Comprehensive error management

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Responsive Breakpoints

- **Mobile**: 480px and below
- **Tablet**: 768px and below
- **Desktop**: 769px and above

## 🎯 Key Components

### Authentication System

- **Login/Register Modals**: Clean modal design with form validation
- **User Sessions**: JWT token-based authentication
- **Profile Management**: User information display and management
- **Password Security**: bcrypt hashing with secure storage

### Navigation System

- **Desktop Navigation**: Logo, sections, user menu with avatar icon
- **Mobile Navigation**: Hamburger menu with user dropdown
- **User Avatar**: Gradient-styled icon throughout the application
- **Theme Toggle**: Light/dark mode with persistence

### User Interface

- **Profile Modal**: User information with icon-based avatar
- **Orders Modal**: Order history and status tracking
- **Settings Modal**: User preferences and account settings
- **Toast Notifications**: Success/error messages (top-right positioned)

### Shopping Experience

- **Product Cards**: Item display with pricing and ratings
- **Shopping Cart**: Full cart management with localStorage
- **Product Modal**: Detailed product view with add-to-cart
- **Search & Filter**: Real-time product filtering
- **Stock Management**: Real-time availability tracking

## 🔧 Development

### Adding New Features

1. **Authentication Features**: Extend the AuthManager class in `auth.js`
2. **Database Models**: Update MongoDB collections and validation
3. **API Endpoints**: Add new routes in `server-atlas.js`
4. **UI Components**: Add HTML structure and corresponding CSS
5. **Frontend Logic**: Implement functionality in appropriate JavaScript module

### Development Workflow

```bash
# Start development server
npm run dev

# Check for errors
node --check server-atlas.js

# Test API endpoints
curl http://localhost:5001/api/auth/register
```

### Environment Setup

Create `.env` file for development:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopzone
JWT_SECRET=development_secret_key_change_in_production
PORT=5001
NODE_ENV=development
```

### Code Structure

- **Modular Design**: Separate concerns between frontend and backend
- **Error Handling**: Comprehensive error management on both ends
- **Validation**: Client-side and server-side validation
- **Security**: JWT tokens, password hashing, input sanitization
- **Performance**: Efficient database queries and frontend optimization

### Testing

Test the authentication system:

1. **Registration**: Create new user account
2. **Login**: Test user authentication
3. **Session**: Verify token persistence
4. **Profile**: Check user data display
5. **Logout**: Confirm session cleanup

## 🚀 Deployment

### MongoDB Atlas Setup

1. **Create Account**: Sign up at https://cloud.mongodb.com
2. **Create Cluster**: Choose free tier (M0 Sandbox)
3. **Network Access**: Add your IP address to whitelist
4. **Database Access**: Create database user with read/write permissions
5. **Connection String**: Copy the connection string and update in `server-atlas.js`

### Environment Variables

Create a `.env` file for production:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
NODE_ENV=production
```

### Cloud Hosting Options

#### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

#### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Railway Deployment

- Connect your GitHub repository to Railway
- Set environment variables in Railway dashboard
- Deploy automatically on git push

### Static Frontend Only

If you want to deploy just the frontend without authentication:

- Use `index.html`, `style.css`, and `js/` folder
- Deploy to Netlify, Vercel, or GitHub Pages
- Remove authentication features from `js/auth.js`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have questions or need help:

1. Check the code comments for detailed explanations
2. Review the console for any error messages
3. Ensure you're running a local server (not opening the HTML file directly)

## 🎉 Credits

Built with ❤️ using modern web technologies:

### Frontend

- **HTML5**: Semantic markup and structure
- **CSS3**: Flexbox, Grid, Variables, Animations
- **JavaScript ES6+**: Modern JavaScript features
- **Responsive Design**: Mobile-first approach

### Backend

- **Node.js**: JavaScript runtime environment
- **Express.js**: Fast web framework
- **MongoDB Atlas**: Cloud database service
- **bcrypt**: Password hashing library
- **jsonwebtoken**: JWT implementation
- **cors**: Cross-origin resource sharing

### Design & UX

- **Google Fonts**: Inter font family
- **SVG Icons**: Scalable vector graphics
- **Gradient Design**: Modern visual aesthetics
- **Icon-Based Avatars**: Consistent user representation
- **Toast Notifications**: User feedback system

---

**Happy Shopping! 🛍️**

_A complete e-commerce solution with authentication, database integration, and responsive design._

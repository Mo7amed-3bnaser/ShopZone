# ShopZone - Deployment Guide

## 🚀 Deploy to Render

### Step 1: Prepare Repository

1. Push your code to GitHub
2. Make sure all files are committed

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub account

### Step 3: Create Web Service

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure settings:
   - **Name**: shopzone-ecommerce
   - **Region**: Choose closest to your users
   - **Branch**: master
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 4: Environment Variables

Add these environment variables in Render dashboard:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=production
```

### Step 5: MongoDB Atlas Setup

1. Go to MongoDB Atlas
2. Create cluster if not exists
3. Go to "Network Access" → Add IP: `0.0.0.0/0` (Allow all)
4. Go to "Database Access" → Create user
5. Copy connection string to MONGODB_URI

### Step 6: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your app will be available at: `https://your-app-name.onrender.com`

## 🔧 Environment Variables Explained

- **MONGODB_URI**: Your MongoDB Atlas connection string
- **JWT_SECRET**: Secret key for JWT tokens (use strong password)
- **NODE_ENV**: Set to 'production' for production deployment

## 📱 Testing

After deployment:

1. Visit your Render URL
2. Test user registration
3. Test user login
4. Test shopping cart functionality
5. Test on mobile devices

## 🆘 Troubleshooting

### App won't start:

- Check build logs in Render dashboard
- Verify all environment variables are set
- Check MongoDB connection string

### Authentication not working:

- Verify JWT_SECRET is set
- Check CORS settings
- Verify MongoDB user permissions

### Database connection failed:

- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Check database user credentials

## 🌟 Performance Tips

1. **MongoDB Atlas**: Use M0 (free tier) for testing
2. **Render**: Free tier sleeps after 15 minutes of inactivity
3. **Upgrade**: Consider paid plans for production use

## 📝 Important Notes

- Free tier on Render goes to sleep after 15 minutes
- First request after sleep takes 30-60 seconds to wake up
- For production, consider upgrading to paid plan
- Always use strong passwords for JWT_SECRET

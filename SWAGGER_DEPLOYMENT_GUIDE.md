# 🚀 Swagger API Documentation Deployment Guide

## ✅ Deployment Status: LIVE

Your Swagger API documentation is now successfully deployed and accessible!

## 🌐 Access Your Swagger Documentation

### Local Development
- **URL:** http://localhost:5000/api-docs
- **Status:** ✅ Running
- **Server:** Development server on port 5000

### How to Access:
1. Make sure your backend server is running:
   ```bash
   cd backend
   npm run dev
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:5000/api-docs
   ```

## 📋 Available API Endpoints

Your Swagger documentation includes comprehensive coverage of all API endpoints:

### 🔐 Authentication APIs
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/users` - Get all users (Admin)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password

### 🛍️ Product APIs
- `GET /api/products` - Get all products (with pagination, filtering)
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### 🛒 Cart APIs
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Update cart items

### ❤️ Wishlist APIs
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Toggle product in wishlist

### 📦 Order APIs
- `GET /api/orders/email/{email}` - Get orders by email (Public)
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `PUT /api/orders/{id}/status` - Update order status (Admin)

### 🎨 Hero Section APIs
- `GET /api/hero` - Get all hero sections
- `POST /api/hero` - Create hero section (Admin)
- `PUT /api/hero/{id}` - Update hero section (Admin)
- `DELETE /api/hero/{id}` - Delete hero section (Admin)

### 🎯 Icon APIs
- `GET /api/icons` - Get all icons
- `GET /api/icons/active` - Get active icons
- `POST /api/icons` - Create icon (Admin)
- `PUT /api/icons/{id}` - Update icon (Admin)
- `DELETE /api/icons/{id}` - Delete icon (Admin)

### 💚 Health Check
- `GET /` - API health check

## 🔑 Authentication

### Using JWT Tokens in Swagger:
1. Click the **"Authorize"** button in the Swagger UI
2. Enter your JWT token in the format: `Bearer your-jwt-token-here`
3. Click **"Authorize"**
4. All protected endpoints will now include your authentication token

### Getting a Token:
1. Use the `/api/auth/login` endpoint
2. Copy the `token` from the response
3. Use it in the Authorization header

## 🎨 Features

### Interactive Testing
- Test all endpoints directly from the browser
- View request/response examples
- Validate API responses in real-time

### File Upload Support
- Upload images for products, heroes, and icons
- Supports multiple file formats
- Maximum 5 images per product

### Comprehensive Documentation
- Detailed parameter descriptions
- Response schemas
- Error handling examples
- Authentication requirements

## 🚀 Production Deployment

For production deployment, update the server URL in `backend/src/config/swagger.ts`:

```typescript
servers: [
  {
    url: 'https://your-production-domain.com',
    description: 'Production server'
  }
]
```

## 📱 Mobile/API Testing

You can also use the Swagger documentation to:
- Generate client SDKs
- Export API specifications
- Share API documentation with team members
- Test API endpoints from mobile apps

## 🔧 Troubleshooting

### If Swagger UI is not accessible:
1. Ensure the backend server is running: `npm run dev`
2. Check if port 5000 is available
3. Verify the server logs for any errors
4. Try accessing: http://localhost:5000/ (should return API status)

### If authentication fails:
1. Make sure you're using the correct JWT token format
2. Check if the token has expired
3. Verify the user has the required permissions for admin endpoints

---

## 🎉 Your Swagger Documentation is Ready!

Visit **http://localhost:5000/api-docs** to explore your fully documented API!

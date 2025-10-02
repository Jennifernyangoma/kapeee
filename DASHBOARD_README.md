# 🛍️ E-commerce Dashboard

A comprehensive admin dashboard for managing your e-commerce store with real-time updates and full CRUD operations.

## ✨ Features

### 🔐 **Authentication**
- Secure admin login with JWT tokens
- Role-based access control
- Session management

### 📊 **Dashboard Overview**
- Real-time statistics
- Product count, hero sections, users
- Featured products tracking
- Visual metrics cards

### 🛒 **Product Management**
- **Create** new products with full details
- **Read** all products in a sortable table
- **Update** existing products
- **Delete** products with confirmation
- Real-time updates across all connected clients
- Image support (ready for file uploads)
- Category management
- Stock tracking
- Featured product toggle

### 🏠 **Hero Content Management**
- **Create** new hero banners
- **Read** all hero sections
- **Update** existing content
- **Delete** hero sections
- Order management for banner positioning
- Active/inactive status toggle
- Real-time updates to frontend

### 👥 **User Management**
- User listing and management
- Role assignment
- Account status control

### ⚙️ **Settings**
- Site configuration
- System preferences
- Admin settings

## 🚀 **Real-time Updates**

The dashboard uses **Socket.IO** for real-time communication:

- **Product Changes**: When you add/edit/delete a product in the dashboard, it instantly updates on the frontend
- **Hero Content**: Hero banner changes appear immediately on the website
- **Live Statistics**: Dashboard metrics update in real-time
- **Multi-user Support**: Multiple admins can work simultaneously

## 🛠️ **Technical Stack**

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time updates
- **React Icons** for UI elements

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **Multer** for file uploads

## 📱 **How to Use**

### 1. **Access the Dashboard**
Navigate to `/admin/dashboard` in your browser

### 2. **Login**
Use the admin credentials:
- **Email**: `mbonimana12@gmail.com`
- **Password**: `admin123`

### 3. **Manage Products**
1. Click on "Products" in the sidebar
2. Click "Add Product" to create new products
3. Fill in product details (title, description, price, category, stock)
4. Toggle "Featured Product" for homepage display
5. Click "Create" to save
6. Use edit/delete buttons to manage existing products

### 4. **Manage Hero Content**
1. Click on "Hero Content" in the sidebar
2. Click "Add Hero Section" to create new banners
3. Set title, subtitle, image URL, and order
4. Toggle active status
5. Changes appear immediately on the frontend

### 5. **Monitor Real-time Updates**
- Open the main website in another tab
- Make changes in the dashboard
- Watch the frontend update instantly!

## 🔧 **API Endpoints**

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Hero Content
- `GET /api/hero` - Get all hero content
- `POST /api/hero` - Create hero content (Admin only)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## 🌐 **Real-time Events**

### Product Events
- `product:created` - New product added
- `product:updated` - Product modified
- `product:deleted` - Product removed

### Hero Events
- `hero:updated` - Hero content changed

## 🎯 **Dashboard Benefits**

1. **No Code Changes**: Update content without touching code
2. **Real-time Updates**: Changes appear instantly on the website
3. **User-friendly**: Intuitive interface for non-technical users
4. **Secure**: Admin-only access with authentication
5. **Scalable**: Built to handle growing product catalogs
6. **Mobile-friendly**: Responsive design works on all devices

## 🔒 **Security Features**

- JWT token authentication
- Role-based access control
- Input validation
- XSS protection
- CSRF protection
- Secure password hashing

## 📈 **Performance**

- Real-time updates without page refresh
- Optimized database queries
- Efficient state management
- Lazy loading for large datasets
- Responsive design for all screen sizes

## 🚀 **Getting Started**

1. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend**:
   ```bash
   npm run dev
   ```

3. **Access Dashboard**:
   - Go to `http://localhost:5173/admin/dashboard`
   - Login with admin credentials
   - Start managing your store!

## 🎉 **Success!**

Your e-commerce dashboard is now fully operational with:
- ✅ Complete CRUD operations
- ✅ Real-time updates
- ✅ Professional UI/UX
- ✅ Secure authentication
- ✅ Mobile responsiveness
- ✅ Socket.IO integration

**Happy managing!** 🛍️✨

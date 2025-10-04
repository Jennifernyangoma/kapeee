# 🚀 Deploy Your Swagger API to Render

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Database**: You'll need a MongoDB Atlas database for production

## 🔧 Step 1: Prepare Your Repository

### 1.1 Update Environment Variables
Create a `.env` file in your backend directory with production values:

```env
# Database (Use MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shop

# JWT Secret (Generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-for-production

# Admin Email
ADMIN_EMAIL=admin@yourdomain.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
NODE_ENV=production
PORT=10000
```

### 1.2 Commit Your Changes
```bash
git add .
git commit -m "Add Swagger documentation and Render deployment config"
git push origin main
```

## 🌐 Step 2: Deploy to Render

### 2.1 Create a New Web Service
1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository

### 2.2 Configure the Service
Fill in the following details:

**Basic Settings:**
- **Name**: `shop-api` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Advanced Settings:**
- **Plan**: Free (or paid if you need more resources)
- **Auto-Deploy**: Yes (deploys automatically on git push)

### 2.3 Environment Variables
Add these environment variables in Render dashboard:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Environment |
| `PORT` | `10000` | Server port |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB connection string |
| `JWT_SECRET` | `your-secret-key` | JWT signing secret |
| `ADMIN_EMAIL` | `admin@yourdomain.com` | Admin user email |
| `EMAIL_HOST` | `smtp.gmail.com` | Email service host |
| `EMAIL_PORT` | `587` | Email service port |
| `EMAIL_USER` | `your-email@gmail.com` | Email username |
| `EMAIL_PASS` | `your-app-password` | Email password |
| `CLOUDINARY_CLOUD_NAME` | `your-cloud-name` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `your-api-key` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `your-api-secret` | Cloudinary API secret |

## 🎯 Step 3: Deploy and Test

### 3.1 Deploy
1. Click **"Create Web Service"**
2. Wait for the build to complete (usually 2-5 minutes)
3. Your service will be available at: `https://your-app-name.onrender.com`

### 3.2 Test Your Swagger Documentation
Once deployed, your Swagger documentation will be available at:
```
https://your-app-name.onrender.com/api-docs
```

### 3.3 Test API Endpoints
Test a few endpoints to ensure everything works:

1. **Health Check**: `GET https://your-app-name.onrender.com/`
2. **Get Products**: `GET https://your-app-name.onrender.com/api/products`
3. **Swagger UI**: `https://your-app-name.onrender.com/api-docs`

## 🔐 Step 4: Set Up MongoDB Atlas (Production Database)

### 4.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free account
3. Create a new cluster

### 4.2 Configure Database Access
1. **Database Access**: Create a user with read/write permissions
2. **Network Access**: Add `0.0.0.0/0` to allow connections from anywhere
3. **Connection String**: Copy the connection string and update `MONGODB_URI`

### 4.3 Update Render Environment Variables
Update the `MONGODB_URI` in your Render dashboard with your Atlas connection string.

## 📧 Step 5: Configure Email Service (Optional)

### 5.1 Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS`

### 5.2 Alternative Email Services
You can also use:
- SendGrid
- Mailgun
- AWS SES

## 🖼️ Step 6: Set Up Cloudinary (For Image Uploads)

### 6.1 Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Create a free account
3. Get your credentials from the dashboard

### 6.2 Update Environment Variables
Add your Cloudinary credentials to Render environment variables.

## 🚀 Step 7: Final Deployment

### 7.1 Trigger Redeploy
After adding all environment variables:
1. Go to your Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### 7.2 Verify Deployment
1. Check the logs for any errors
2. Test your Swagger documentation
3. Test API endpoints
4. Verify database connection

## 📱 Step 8: Access Your Live API

### Your Live Swagger Documentation:
```
https://your-app-name.onrender.com/api-docs
```

### API Base URL:
```
https://your-app-name.onrender.com/api
```

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Database Connection**: Verify MongoDB URI and network access
3. **Environment Variables**: Ensure all required variables are set
4. **Port Issues**: Render automatically sets the PORT environment variable

### Logs:
- Check Render dashboard logs for detailed error messages
- Use `console.log()` statements for debugging

## 🎉 Success!

Once deployed, you'll have:
- ✅ Live API server on Render
- ✅ Swagger documentation accessible worldwide
- ✅ Production-ready database
- ✅ Image upload capabilities
- ✅ Email functionality
- ✅ Automatic deployments on git push

## 📞 Support

If you encounter issues:
1. Check Render logs
2. Verify environment variables
3. Test locally first
4. Check MongoDB Atlas connection
5. Verify all services are properly configured

---

**Your Swagger API is now live and accessible to the world! 🌍**

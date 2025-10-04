# 🚀 Deploy Your Swagger API to Railway

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Railway Account**: Sign up at [railway.app](https://railway.app)
3. **MongoDB Database**: You'll need a MongoDB Atlas database for production

## 🔧 Step 1: Prepare Your Repository

### 1.1 Push Your Code to GitHub
Make sure your backend code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Add complete backend with Swagger UI for Railway deployment"
git push origin main
```

### 1.2 Environment Variables
The backend includes an `env.example` file with all required environment variables. You'll set these in Railway's dashboard.

## 🌐 Step 2: Deploy to Railway

### 2.1 Create a New Project
1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository

### 2.2 Configure the Service
Railway will automatically detect your Node.js application in the `backend` directory.

**Settings to configure:**
- **Root Directory**: `backend` (Railway should auto-detect this)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 2.3 Environment Variables
Add these environment variables in Railway dashboard:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Environment |
| `PORT` | `5000` | Server port (Railway will override this) |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB connection string |
| `JWT_SECRET` | `your-secret-key` | JWT signing secret |
| `ADMIN_EMAIL` | `admin@yourdomain.com` | Admin user email |
| `EMAIL_HOST` | `smtp.gmail.com` | Email service host (optional) |
| `EMAIL_PORT` | `587` | Email service port (optional) |
| `EMAIL_USER` | `your-email@gmail.com` | Email username (optional) |
| `EMAIL_PASS` | `your-app-password` | Email password (optional) |
| `CLOUDINARY_CLOUD_NAME` | `your-cloud-name` | Cloudinary cloud name (optional) |
| `CLOUDINARY_API_KEY` | `your-api-key` | Cloudinary API key (optional) |
| `CLOUDINARY_API_SECRET` | `your-api-secret` | Cloudinary API secret (optional) |

## 🎯 Step 3: Deploy and Test

### 3.1 Deploy
1. Railway will automatically start building and deploying your application
2. Wait for the build to complete (usually 2-5 minutes)
3. Your service will be available at: `https://your-app-name.railway.app`

### 3.2 Test Your Swagger Documentation
Once deployed, your Swagger documentation will be available at:
```
https://your-app-name.railway.app/api-docs
```

### 3.3 Test API Endpoints
Test a few endpoints to ensure everything works:

1. **Health Check**: `GET https://your-app-name.railway.app/`
2. **Get Products**: `GET https://your-app-name.railway.app/api/products`
3. **Swagger UI**: `https://your-app-name.railway.app/api-docs`

## 🔐 Step 4: Set Up MongoDB Atlas (Production Database)

### 4.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free account
3. Create a new cluster

### 4.2 Configure Database Access
1. **Database Access**: Create a user with read/write permissions
2. **Network Access**: Add `0.0.0.0/0` to allow connections from anywhere
3. **Connection String**: Copy the connection string and update `MONGODB_URI`

### 4.3 Update Railway Environment Variables
Update the `MONGODB_URI` in your Railway dashboard with your Atlas connection string.

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

## 🖼️ Step 6: Set Up Cloudinary (For Image Uploads - Optional)

### 6.1 Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Create a free account
3. Get your credentials from the dashboard

### 6.2 Update Environment Variables
Add your Cloudinary credentials to Railway environment variables.

## 🚀 Step 7: Final Deployment

### 7.1 Trigger Redeploy
After adding all environment variables:
1. Go to your Railway dashboard
2. Click **"Redeploy"** to apply the new environment variables

### 7.2 Verify Deployment
1. Check the logs for any errors
2. Test your Swagger documentation
3. Test API endpoints
4. Verify database connection

## 📱 Step 8: Access Your Live API

### Your Live Swagger Documentation:
```
https://your-app-name.railway.app/api-docs
```

### API Base URL:
```
https://your-app-name.railway.app/api
```

## 🔧 Railway-Specific Features

### Automatic Deployments
- Railway automatically deploys when you push to your main branch
- No manual deployment needed

### Custom Domains
- You can add custom domains in Railway dashboard
- SSL certificates are automatically provisioned

### Environment Management
- Easy environment variable management
- Separate environments for staging/production

### Monitoring
- Built-in logs and metrics
- Health checks and uptime monitoring

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**: 
   - Check that all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **Database Connection**: 
   - Verify MongoDB URI and network access
   - Check Railway logs for connection errors

3. **Environment Variables**: 
   - Ensure all required variables are set
   - Check for typos in variable names

4. **Port Issues**: 
   - Railway automatically sets the PORT environment variable
   - Your app should use `process.env.PORT`

### Logs:
- Check Railway dashboard logs for detailed error messages
- Use `console.log()` statements for debugging

## 🎉 Success!

Once deployed, you'll have:
- ✅ Live API server on Railway
- ✅ Swagger documentation accessible worldwide
- ✅ Production-ready database
- ✅ Image upload capabilities (if configured)
- ✅ Email functionality (if configured)
- ✅ Automatic deployments on git push
- ✅ Custom domain support
- ✅ SSL certificates

## 📞 Support

If you encounter issues:
1. Check Railway logs
2. Verify environment variables
3. Test locally first
4. Check MongoDB Atlas connection
5. Verify all services are properly configured

## 🔄 Local Development

To run locally for testing:

```bash
cd backend
npm install
npm run dev
```

Your local Swagger UI will be available at:
```
http://localhost:5000/api-docs
```

---

**Your Swagger API is now live and accessible to the world! 🌍**

**Railway Benefits:**
- 🚀 **Fast deployments** - Deploy in seconds
- 💰 **Free tier** - Generous free usage
- 🔄 **Auto-deploy** - Deploy on every git push
- 🌐 **Global CDN** - Fast worldwide access
- 🔒 **SSL included** - Automatic HTTPS
- 📊 **Built-in monitoring** - Logs and metrics

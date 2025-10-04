# 🚀 Render Deployment Fix - Start Command Error

## ❌ **Problem:**
```
error Command "start" not found.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
==> Exited with status 1
```

## ✅ **Solution Applied:**

### 1. **Added Start Script to Root Package.json**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "start": "cd backend && npm start",
    "start:backend": "cd backend && npm run dev"
  }
}
```

### 2. **Updated Render Configuration**
```yaml
services:
  - type: web
    name: shop-api
    env: node
    plan: free
    buildCommand: npm install && cd backend && npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    healthCheckPath: /
```

## 🔧 **Alternative Render Dashboard Configuration:**

If you're setting up through the Render dashboard instead of using the YAML file:

### **Basic Settings:**
- **Name**: `shop-api`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty (use root)

### **Build & Deploy:**
- **Build Command**: `npm install && cd backend && npm install && npm run build`
- **Start Command**: `npm start`

### **Environment Variables:**
| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Environment |
| `PORT` | `10000` | Server port (Render will override this) |
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

## 🚀 **Deployment Steps:**

### 1. **Commit Your Changes**
```bash
git add .
git commit -m "Fix Render deployment - add start script"
git push origin main
```

### 2. **Redeploy on Render**
- Go to your Render dashboard
- Click **"Manual Deploy"** → **"Deploy latest commit"**
- Or trigger automatic deployment by pushing to your main branch

### 3. **Verify Deployment**
- Check the build logs for any errors
- Once deployed, test your API endpoints
- Access Swagger docs at: `https://your-app-name.onrender.com/api-docs`

## 🔍 **Troubleshooting:**

### **If Build Still Fails:**
1. **Check Build Logs** - Look for specific error messages
2. **Verify Dependencies** - Ensure all required packages are in package.json
3. **Check Environment Variables** - Make sure all required variables are set
4. **Test Locally** - Run `npm start` locally to ensure it works

### **Common Issues:**
- **Missing Dependencies**: Add any missing packages to package.json
- **Environment Variables**: Ensure all required variables are configured
- **Port Issues**: Render automatically sets PORT, don't override it
- **Database Connection**: Verify MongoDB URI is correct

## ✅ **Expected Result:**

After successful deployment:
- ✅ Build completes without errors
- ✅ Server starts successfully
- ✅ API endpoints respond correctly
- ✅ Swagger documentation accessible
- ✅ Database connection established

## 🎯 **Your Live API Will Be Available At:**
```
https://your-app-name.onrender.com/api-docs
```

## 📞 **Need Help?**

If you still encounter issues:
1. Check Render build logs for specific error messages
2. Verify all environment variables are set correctly
3. Test the build process locally first
4. Ensure your MongoDB Atlas database is accessible from Render's IP ranges

---

**Your Swagger API should now deploy successfully to Render! 🚀**

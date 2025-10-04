@echo off
echo 🚀 Building backend for Render deployment...

cd backend

echo 📦 Installing dependencies...
call npm install

echo 🔨 Building TypeScript...
call npm run build

echo 📋 Copying production package.json...
copy package.prod.json package.json

echo 🧹 Installing production dependencies only...
call npm ci --only=production

echo ✅ Build complete! Ready for deployment.
echo 📁 Compiled files are in backend/dist/
echo 📦 Production package.json is ready

pause

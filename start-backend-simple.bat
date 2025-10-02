@echo off
echo Starting E-commerce Backend Server...
echo.

echo Seeding database with initial data...
cd backend
node seedData.js

echo.
echo Starting backend server...
npm run dev

pause

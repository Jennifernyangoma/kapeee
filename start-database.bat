@echo off
echo Starting MongoDB and Backend Server...
echo.

echo Step 1: Starting MongoDB...
start "MongoDB" cmd /k "mongod --dbpath C:\data\db"

echo Waiting for MongoDB to start...
timeout /t 5 /nobreak > nul

echo Step 2: Seeding database...
cd backend
node seedData.js

echo Step 3: Starting backend server...
npm run dev

pause

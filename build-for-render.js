#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building for Render deployment...');

try {
  // Change to backend directory
  process.chdir('backend');
  
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🔨 Building TypeScript...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('📋 Copying production package.json...');
  fs.copyFileSync('package.prod.json', 'package.json');
  
  console.log('🧹 Cleaning up dev dependencies...');
  execSync('npm ci --only=production', { stdio: 'inherit' });
  
  console.log('✅ Build complete! Ready for deployment.');
  console.log('📁 Compiled files are in backend/dist/');
  console.log('📦 Production package.json is ready');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

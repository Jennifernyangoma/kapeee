// Socket.IO Connection Test Script
// Run this script to test all socket connections

import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

console.log('🔌 Testing Socket.IO Connections...\n');

// Connection Events
socket.on('connect', () => {
  console.log('✅ Connected to server with ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

// Product Events
socket.on('product:created', (product) => {
  console.log('🛍️  Product Created:', product.title);
});

socket.on('product:updated', (product) => {
  console.log('✏️  Product Updated:', product.title);
});

socket.on('product:deleted', (data) => {
  console.log('🗑️  Product Deleted:', data.id);
});

// Order Events
socket.on('order:created', (order) => {
  console.log('📦 Order Created:', order.orderNumber || order._id);
});

socket.on('order:updated', (order) => {
  console.log('📝 Order Updated:', order.orderNumber || order._id);
});

socket.on('order:deleted', (data) => {
  console.log('🗑️  Order Deleted:', data.id);
});

// Hero Events
socket.on('hero:updated', (hero) => {
  console.log('🎭 Hero Updated:', hero.title || hero._id);
});

socket.on('hero:deleted', (data) => {
  console.log('🗑️  Hero Deleted:', data.id);
});

// Icon Events
socket.on('icon:created', (icon) => {
  console.log('🎨 Icon Created:', icon.name || icon._id);
});

socket.on('icon:updated', (icon) => {
  console.log('✏️  Icon Updated:', icon.name || icon._id);
});

socket.on('icon:deleted', (data) => {
  console.log('🗑️  Icon Deleted:', data.id);
});

// Cart Events
socket.on('cart:updated', (data) => {
  console.log('🛒 Cart Updated for user:', data.userId);
});

// Wishlist Events
socket.on('wishlist:updated', (data) => {
  console.log('❤️  Wishlist Updated for user:', data.userId);
});

// Error handling
socket.on('connect_error', (error) => {
  console.log('❌ Connection Error:', error.message);
});

socket.on('error', (error) => {
  console.log('❌ Socket Error:', error);
});

// Keep the connection alive and log status
setTimeout(() => {
  if (socket.connected) {
    console.log('\n🎉 Socket connection test completed successfully!');
    console.log('📡 Socket is connected and listening for events...');
    console.log('🔍 Try performing actions in the admin dashboard to see real-time updates!');
  } else {
    console.log('\n❌ Socket connection failed!');
    console.log('🔧 Make sure the backend server is running on http://localhost:5000');
  }
}, 2000);

// Keep script running
process.on('SIGINT', () => {
  console.log('\n👋 Disconnecting socket...');
  socket.disconnect();
  process.exit(0);
});

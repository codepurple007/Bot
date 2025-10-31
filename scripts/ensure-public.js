import { mkdirSync, writeFileSync } from 'fs';
try {
  mkdirSync('public', { recursive: true });
  // Create a simple index.html so Vercel recognizes this as output
  writeFileSync('public/index.html', '<!DOCTYPE html><html><head><title>Telegram Bot</title></head><body><h1>Serverless Functions Only</h1><p>This project uses serverless functions in /api</p></body></html>');
  console.log('✅ Public directory and index.html created');
} catch (e) {
  console.error('Error creating public directory:', e);
  process.exit(1);
}


#!/usr/bin/env node

/**
 * Environment Setup Checker for Jaguar SDK
 * Run with: node scripts/check-env.js
 */

const fs = require('node:fs');
const path = require('node:path');

console.log('🔍 Checking Jaguar SDK Environment Setup...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('   Create one by copying .env.example');
  process.exit(1);
}

// Load environment variables
require('dotenv').config();

const checks = [
  {
    name: 'AUTH_SECRET',
    required: true,
    description: 'Authentication secret for NextAuth',
    check: (value) => value && value.length >= 32,
    help: 'Generate at https://generate-secret.vercel.app/32',
  },
  {
    name: 'POSTGRES_URL',
    required: true,
    description: 'Database connection (Supabase)',
    check: (value) => value?.startsWith('postgresql://'),
    help: 'Get from Supabase project Settings → Database',
  },
  {
    name: 'XAI_API_KEY',
    required: true,
    description: 'AI model API key',
    check: (value) => value?.startsWith('xai-'),
    help: 'Get from https://console.x.ai/',
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    required: false,
    description: 'Supabase project URL (optional)',
    check: (value) => !value || value.startsWith('https://'),
    help: 'Get from Supabase project Settings → API',
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: false,
    description: 'Supabase anonymous key (optional)',
    check: (value) => !value || value.length > 50,
    help: 'Get from Supabase project Settings → API',
  },
  {
    name: 'BLOB_READ_WRITE_TOKEN',
    required: false,
    description: 'File storage token (optional)',
    check: (value) => !value || value.startsWith('vercel_blob_'),
    help: 'Get from Vercel project Storage → Blob',
  },
  {
    name: 'REDIS_URL',
    required: false,
    description: 'Redis cache URL (optional)',
    check: (value) => !value || value.startsWith('redis://'),
    help: 'Get from Upstash or other Redis provider',
  },
];

let allRequired = true;
let hasOptional = false;

console.log('📋 Environment Variables Check:\n');

checks.forEach(({ name, required, description, check, help }) => {
  const value = process.env[name];
  const hasValue = value && value.trim() !== '';
  const isValid = hasValue ? check(value) : false;

  let status = '❌';
  let message = '';

  if (required) {
    if (hasValue && isValid) {
      status = '✅';
      message = 'Set and valid';
    } else if (hasValue && !isValid) {
      status = '⚠️';
      message = 'Set but invalid format';
      allRequired = false;
    } else {
      status = '❌';
      message = 'Missing (required)';
      allRequired = false;
    }
  } else {
    if (hasValue && isValid) {
      status = '✅';
      message = 'Set and valid';
      hasOptional = true;
    } else if (hasValue && !isValid) {
      status = '⚠️';
      message = 'Set but invalid format';
    } else {
      status = '⚪';
      message = 'Not set (optional)';
    }
  }

  console.log(`${status} ${name}`);
  console.log(`   ${description}`);
  console.log(`   Status: ${message}`);

  if (!isValid && hasValue) {
    console.log(`   Help: ${help}`);
  }

  console.log('');
});

console.log('📊 Summary:\n');

if (allRequired) {
  console.log('✅ All required environment variables are set!');
  console.log('🚀 You can start the development server with: npm run dev');
} else {
  console.log('❌ Some required environment variables are missing or invalid.');
  console.log('📖 Check SETUP.md for detailed instructions.');
}

if (hasOptional) {
  console.log('🎉 You have some optional features configured!');
} else {
  console.log(
    '💡 Consider setting up optional features for enhanced functionality.',
  );
}

console.log('\n🔗 Quick Links:');
console.log('   • Setup Guide: ./SETUP.md');
console.log('   • Supabase: https://supabase.com');
console.log('   • xAI Console: https://console.x.ai/');
console.log('   • Generate Secret: https://generate-secret.vercel.app/32');

process.exit(allRequired ? 0 : 1);

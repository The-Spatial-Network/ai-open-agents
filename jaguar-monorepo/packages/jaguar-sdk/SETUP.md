# 🚀 Jaguar SDK Setup Guide

This guide will help you set up all the required environment variables to get Jaguar SDK running locally.

## 📋 Quick Setup Checklist

- [ ] **Database (Required)** - Supabase PostgreSQL
- [ ] **AI Models (Required)** - xAI API Key
- [ ] **File Storage (Optional)** - Vercel Blob
- [ ] **Caching (Optional)** - Redis

## 🗄️ Database Setup (REQUIRED)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Choose organization and enter:
   - **Name**: `jaguar-sdk`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to you
5. Wait 2-3 minutes for project creation

### Step 2: Get Database Connection String

1. In your Supabase project, go to **Settings → Database**
2. Scroll down to **Connection String**
3. Copy the **URI** format string
4. Replace `[YOUR-PASSWORD]` with your actual database password
5. Add to `.env`:
   ```env
   POSTGRES_URL=postgresql://postgres:your-password@db.your-ref.supabase.co:5432/postgres
   ```

### Step 3: Run Database Migrations

```bash
npm run db:migrate
```

## 🤖 AI Models Setup (REQUIRED)

### Get xAI API Key

1. Go to [console.x.ai](https://console.x.ai/)
2. Sign up/login
3. Go to **API Keys**
4. Click **Create API Key**
5. Copy the key and add to `.env`:
   ```env
   XAI_API_KEY=xai-your-api-key-here
   ```

## 📁 File Storage Setup (OPTIONAL)

### Vercel Blob Storage

1. Go to [vercel.com](https://vercel.com)
2. Create account/login
3. Create new project or use existing
4. Go to **Storage → Create Database → Blob**
5. Copy the token and add to `.env`:
   ```env
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your-token
   ```

## ⚡ Caching Setup (OPTIONAL)

### Redis (Upstash)

1. Go to [upstash.com](https://upstash.com)
2. Create account/login
3. Create Redis database
4. Copy connection URL and add to `.env`:
   ```env
   REDIS_URL=redis://your-redis-url
   ```

## 🔐 Security Notes

- ✅ `.env` is already in `.gitignore` - your keys are safe
- ✅ Never commit `.env` to git
- ✅ Use different keys for development vs production
- ✅ Rotate keys regularly

## 🧪 Testing Your Setup

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test Landing Page

- Go to `http://localhost:3002`
- Enter a dream agent description
- Click submit button

### 3. Test Chat Flow

- Should redirect to `/dashboard/chat`
- Your message should auto-submit
- AI should respond (requires xAI key)

## 🚨 Troubleshooting

### Database Connection Issues

```bash
# Check if migrations ran successfully
npm run db:migrate

# Verify connection string format
# Should be: postgresql://postgres:password@db.ref.supabase.co:5432/postgres
```

### Authentication Errors

- Make sure `POSTGRES_URL` is set correctly
- Verify Supabase project is active
- Check database password is correct

### AI Chat Not Working

- Verify `XAI_API_KEY` is set
- Check API key is valid at console.x.ai
- Ensure you have API credits

## 📞 Need Help?

If you run into issues:

1. Check the terminal for error messages
2. Verify all required environment variables are set
3. Test each service individually
4. Check service status pages (Supabase, xAI)

## 🎯 Minimum Required Setup

To get the basic chat working, you only need:

1. **POSTGRES_URL** (Supabase database)
2. **XAI_API_KEY** (AI responses)

Everything else is optional for enhanced features!

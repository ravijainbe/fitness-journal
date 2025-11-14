# 🔐 Supabase Setup Guide

This guide will help you set up authentication and cloud database for your Fitness Journal app.

## Why Supabase?

- ✅ **Free tier** with generous limits
- ✅ **PostgreSQL database** in the cloud
- ✅ **Built-in authentication** (email, OAuth, etc.)
- ✅ **Real-time subscriptions**
- ✅ **Automatic API generation**
- ✅ **Row-level security**

---

## Step 1: Create Supabase Account

1. Go to: https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub (recommended) or email
4. Verify your email

---

## Step 2: Create a New Project

1. Click **"New Project"**
2. Fill in:
   - **Name**: `fitness-journal`
   - **Database Password**: (generate a strong password and save it)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup to complete

---

## Step 3: Create Database Tables

### 3.1 Create Activities Table

1. Go to **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Paste this SQL:

```sql
-- Create activities table
CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    local_id BIGINT,
    type TEXT NOT NULL,
    duration INTEGER NOT NULL,
    distance DECIMAL(10, 2),
    calories INTEGER,
    notes TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own activities
CREATE POLICY "Users can view own activities"
    ON activities FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy: Users can insert their own activities
CREATE POLICY "Users can insert own activities"
    ON activities FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own activities
CREATE POLICY "Users can update own activities"
    ON activities FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policy: Users can delete their own activities
CREATE POLICY "Users can delete own activities"
    ON activities FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX activities_user_id_idx ON activities(user_id);
CREATE INDEX activities_date_idx ON activities(date);
CREATE INDEX activities_type_idx ON activities(type);
```

4. Click **"Run"**

### 3.2 Create Goals Table

1. Click **"New query"** again
2. Paste this SQL:

```sql
-- Create goals table
CREATE TABLE goals (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    local_id BIGINT,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    target DECIMAL(10, 2) NOT NULL,
    target_date DATE NOT NULL,
    description TEXT,
    created_date DATE NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own goals
CREATE POLICY "Users can view own goals"
    ON goals FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy: Users can insert their own goals
CREATE POLICY "Users can insert own goals"
    ON goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own goals
CREATE POLICY "Users can update own goals"
    ON goals FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policy: Users can delete their own goals
CREATE POLICY "Users can delete own goals"
    ON goals FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX goals_user_id_idx ON goals(user_id);
CREATE INDEX goals_target_date_idx ON goals(target_date);
CREATE INDEX goals_status_idx ON goals(status);
```

3. Click **"Run"**

---

## Step 4: Configure Authentication

1. Go to **Authentication** → **Providers** in the left sidebar
2. **Email** provider should be enabled by default
3. Optional: Enable other providers (Google, GitHub, etc.)
4. Go to **Authentication** → **URL Configuration**
5. Add your site URL: `https://rj-fitness-journal.netlify.app`
6. Add redirect URLs:
   - `https://rj-fitness-journal.netlify.app`
   - `http://localhost:5500` (for local testing)

---

## Step 5: Get API Keys

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)

---

## Step 6: Update Your Code

### 6.1 Update auth.js

Open `fitness-journal/auth.js` and replace:

```javascript
this.supabaseUrl = 'YOUR_SUPABASE_URL';
this.supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

With your actual values:

```javascript
this.supabaseUrl = 'https://xxxxx.supabase.co';
this.supabaseKey = 'eyJhbGc...your-actual-key...';
```

### 6.2 Update cloud-db.js

Open `fitness-journal/cloud-db.js` and replace:

```javascript
this.supabaseUrl = 'YOUR_SUPABASE_URL';
this.supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

With your actual values:

```javascript
this.supabaseUrl = 'https://xxxxx.supabase.co';
this.supabaseKey = 'eyJhbGc...your-actual-key...';
```

---

## Step 7: Deploy to Netlify

1. Commit your changes:
```bash
git add .
git commit -m "Add authentication and cloud sync"
git push origin main
```

2. Netlify will automatically deploy (wait ~30 seconds)

3. Visit: https://rj-fitness-journal.netlify.app

---

## Step 8: Test the App

### Test Signup
1. Visit your app
2. Click "Sign Up"
3. Enter name, email, and password
4. Check your email for verification (if enabled)
5. Sign in

### Test Data Sync
1. Log an activity
2. Create a goal
3. Open the app in a different browser
4. Sign in with the same account
5. Your data should appear!

### Test Sync Button
1. Log activities in one browser
2. Click the "🔄 Sync" button
3. Data should sync from cloud

---

## Features You Get

### ✅ User Authentication
- Email/password signup and login
- Password reset via email
- Secure session management
- Automatic token refresh

### ✅ Cloud Data Storage
- All activities stored in PostgreSQL
- All goals stored in PostgreSQL
- Data synced across devices
- Automatic backup

### ✅ Data Security
- Row-level security (users only see their own data)
- Encrypted connections (HTTPS)
- Secure API keys
- No data leakage between users

### ✅ Offline Support
- Local IndexedDB cache
- Works offline
- Syncs when online
- Manual sync button

---

## Fallback Mode (Without Supabase)

If you don't configure Supabase, the app will work in **local-only mode**:

- ✅ Authentication using localStorage
- ✅ Data stored in IndexedDB
- ✅ Works completely offline
- ❌ No cross-device sync
- ❌ No cloud backup

This is perfect for:
- Testing locally
- Privacy-focused users
- Offline-only usage

---

## Troubleshooting

### Issue: "Invalid API key"
**Solution**: Double-check you copied the correct anon public key from Supabase

### Issue: "User already registered"
**Solution**: Use a different email or reset password

### Issue: "Failed to sync"
**Solution**: 
- Check internet connection
- Verify Supabase project is running
- Check browser console for errors

### Issue: "Row Level Security" errors
**Solution**: Make sure you ran all the SQL policies in Step 3

### Issue: Data not syncing
**Solution**:
- Click the "🔄 Sync" button manually
- Check if user is logged in
- Verify API keys are correct

---

## Database Schema

### Activities Table
```
id              BIGSERIAL PRIMARY KEY
user_id         UUID (references auth.users)
local_id        BIGINT
type            TEXT (running, cycling, etc.)
duration        INTEGER (minutes)
distance        DECIMAL (km)
calories        INTEGER
notes           TEXT
date            DATE
created_at      TIMESTAMP
synced_at       TIMESTAMP
```

### Goals Table
```
id              BIGSERIAL PRIMARY KEY
user_id         UUID (references auth.users)
local_id        BIGINT
title           TEXT
type            TEXT (frequency, duration, distance, weight)
target          DECIMAL
target_date     DATE
description     TEXT
created_date    DATE
status          TEXT (active, completed, archived)
created_at      TIMESTAMP
synced_at       TIMESTAMP
```

---

## Security Best Practices

1. **Never commit API keys to Git** (use environment variables in production)
2. **Enable email verification** in Supabase Auth settings
3. **Use strong passwords** (min 8 characters, mixed case, numbers, symbols)
4. **Enable 2FA** on your Supabase account
5. **Regularly backup** your database
6. **Monitor usage** in Supabase dashboard

---

## Free Tier Limits

Supabase Free Tier includes:
- ✅ 500 MB database space
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests

Perfect for personal use and small teams!

---

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Create database tables
3. ✅ Update API keys in code
4. ✅ Deploy to Netlify
5. ✅ Test authentication
6. ✅ Test data sync
7. 🎉 Start tracking your fitness!

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **GitHub Issues**: Report bugs in your repository

---

**Your fitness journal now has cloud sync and works across all your devices!** 🎉💪

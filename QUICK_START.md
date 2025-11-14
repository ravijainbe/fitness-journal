# 🚀 Quick Start: Deploy to Netlify via GitHub

## Prerequisites Setup

### 1. Install Git (if not already installed)

**Download Git for Windows**:
- Go to: https://git-scm.com/download/win
- Download and run the installer
- Use default settings during installation
- Restart your terminal/command prompt after installation

**Verify installation**:
```bash
git --version
```

### 2. Create GitHub Account (if needed)
- Go to: https://github.com/signup
- Create a free account

## Deployment Steps

### Step 1: Initialize Git Repository

Open Command Prompt or PowerShell in the `fitness-journal` folder:

```bash
# Initialize Git
git init

# Configure Git (first time only - use your info)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Fitness Journal app"
```

### Step 2: Create GitHub Repository

**Option A: Using GitHub Website** (Recommended)

1. Go to: https://github.com/new

2. Fill in:
   - **Repository name**: `fitness-journal`
   - **Description**: `Health and fitness tracking app with IndexedDB`
   - **Visibility**: Public (or Private if you prefer)
   - ❌ **Do NOT check** "Add a README file"
   - Click **"Create repository"**

3. Copy the commands shown and run them:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/fitness-journal.git
   git branch -M main
   git push -u origin main
   ```
   
   Replace `YOUR_USERNAME` with your actual GitHub username.

4. Enter your GitHub credentials when prompted

### Step 3: Deploy to Netlify

1. **Go to Netlify**: https://app.netlify.com

2. **Sign up/Login**:
   - Click "Sign up with GitHub" (easiest option)
   - Authorize Netlify to access your GitHub

3. **Import project**:
   - Click **"Add new site"** → **"Import an existing project"**
   - Click **"GitHub"**
   - Select your **"fitness-journal"** repository
   
4. **Configure deployment**:
   ```
   Branch to deploy: main
   Build command: (leave empty)
   Publish directory: .
   ```
   - Click **"Deploy site"**

5. **Wait for deployment** (~30 seconds)
   - Your site will be live at a URL like: `https://random-name-123456.netlify.app`

### Step 4: Customize Site Name

1. In Netlify dashboard, go to **Site settings**
2. Click **"Change site name"**
3. Enter your preferred name (e.g., `my-fitness-journal`)
4. Your site is now at: `https://my-fitness-journal.netlify.app`

## 🎉 Done!

Your app is now live and will auto-deploy whenever you push changes to GitHub!

## Making Updates

```bash
# Make changes to your files
# ... edit code ...

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

Netlify will automatically detect the push and redeploy your site!

## Alternative: Skip Git and Use Netlify Drop

If you prefer not to use Git/GitHub:

1. Go to: https://app.netlify.com/drop
2. Drag the entire `fitness-journal` folder
3. Done! Your site is live instantly

**Note**: This method doesn't provide automatic updates or version control.

## Troubleshooting

### Git not recognized
- Install Git from: https://git-scm.com/download/win
- Restart your terminal after installation

### Authentication failed
- Use GitHub Personal Access Token instead of password
- Generate at: https://github.com/settings/tokens
- Use token as password when pushing

### Repository not found in Netlify
- Go to: https://github.com/settings/installations
- Click on Netlify
- Grant access to your repository

## Need Help?

- **Git Help**: https://git-scm.com/doc
- **GitHub Help**: https://docs.github.com
- **Netlify Help**: https://docs.netlify.com

---

**Your fitness tracking app will be live on the internet with automatic deployments! 💪**

# GitHub + Netlify Deployment Guide

Follow these steps to deploy your Fitness Journal app using GitHub and Netlify for continuous deployment.

## Step 1: Initialize Git Repository

Open your terminal and navigate to the fitness-journal directory:

```bash
cd fitness-journal
```

Initialize Git and make your first commit:

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Fitness Journal with IndexedDB"
```

## Step 2: Create GitHub Repository

### Option A: Using GitHub CLI (if installed)
```bash
# Create repository
gh repo create fitness-journal --public --source=. --remote=origin

# Push code
git push -u origin main
```

### Option B: Using GitHub Website

1. **Go to GitHub**: https://github.com/new

2. **Create new repository**:
   - Repository name: `fitness-journal`
   - Description: `A comprehensive health and fitness tracking application with activity logging, goal setting, and progress visualization`
   - Visibility: Choose **Public** or **Private**
   - ❌ Do NOT initialize with README, .gitignore, or license (we already have these)
   - Click **Create repository**

3. **Push your code**:
   ```bash
   # Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/fitness-journal.git
   
   # Rename branch to main (if needed)
   git branch -M main
   
   # Push code
   git push -u origin main
   ```

## Step 3: Connect to Netlify

1. **Go to Netlify**: https://app.netlify.com

2. **Sign in/Sign up**:
   - Use your GitHub account for easier integration
   - Click "Sign up with GitHub" or "Log in with GitHub"

3. **Add new site**:
   - Click **"Add new site"** button
   - Select **"Import an existing project"**

4. **Connect to Git provider**:
   - Click **"GitHub"**
   - Authorize Netlify to access your GitHub account (if first time)
   - You may need to configure GitHub App permissions

5. **Select repository**:
   - Find and click on **"fitness-journal"** repository
   - If you don't see it, click "Configure Netlify on GitHub" to grant access

6. **Configure build settings**:
   ```
   Branch to deploy: main
   Build command: (leave empty)
   Publish directory: .
   ```
   - Click **"Deploy site"**

7. **Wait for deployment**:
   - Netlify will build and deploy your site (takes ~30 seconds)
   - You'll see a random URL like `https://random-name-123456.netlify.app`

## Step 4: Customize Your Site

### Change Site Name
1. Go to **Site settings** → **General** → **Site details**
2. Click **"Change site name"**
3. Enter your preferred name (e.g., `my-fitness-journal`)
4. Your site will be available at `https://my-fitness-journal.netlify.app`

### Add Custom Domain (Optional)
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow instructions to configure DNS

## Step 5: Verify Deployment

Visit your Netlify URL and test:
- ✅ Dashboard loads
- ✅ Log activities
- ✅ Create goals
- ✅ View progress charts
- ✅ Export/Import data
- ✅ Data persists (IndexedDB)

## Step 6: Future Updates

Now that everything is connected, deploying updates is automatic:

```bash
# Make changes to your code
# ... edit files ...

# Commit changes
git add .
git commit -m "Add new feature or fix bug"

# Push to GitHub
git push origin main
```

**Netlify will automatically**:
- Detect the push to GitHub
- Build and deploy your changes
- Update your live site in ~30 seconds

## Deployment Status Badge (Optional)

Add a deployment status badge to your README:

```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)
```

Find your site ID in: Site settings → General → Site details

## Useful Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Create a new branch for features
git checkout -b feature-name

# Switch back to main
git checkout main

# Merge feature branch
git merge feature-name

# Pull latest changes
git pull origin main
```

## Netlify Features You Get

✅ **Automatic deployments** - Push to GitHub, auto-deploy
✅ **Deploy previews** - Test changes before merging
✅ **Rollback** - Instantly revert to previous versions
✅ **HTTPS** - Free SSL certificate
✅ **Global CDN** - Fast loading worldwide
✅ **Branch deploys** - Test features on separate URLs
✅ **Build notifications** - Email/Slack alerts

## Branch Deploys (Advanced)

Create feature branches that auto-deploy to preview URLs:

```bash
# Create feature branch
git checkout -b new-feature

# Make changes and push
git add .
git commit -m "Add new feature"
git push origin new-feature
```

Netlify will create a preview URL like:
`https://new-feature--my-fitness-journal.netlify.app`

## Troubleshooting

### Issue: Repository not showing in Netlify
**Solution**: 
- Go to https://github.com/settings/installations
- Find Netlify and configure repository access
- Grant access to your fitness-journal repository

### Issue: Build fails
**Solution**: 
- Check Netlify build logs
- Ensure `netlify.toml` is in the repository root
- Verify all files are committed and pushed

### Issue: Changes not deploying
**Solution**:
- Check if push was successful: `git log origin/main`
- View deploy logs in Netlify dashboard
- Trigger manual deploy in Netlify if needed

## Environment Variables (Future Use)

If you need to add API keys or secrets:

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add key-value pairs
4. Redeploy for changes to take effect

## Monitoring

- **Deploy logs**: Site → Deploys → Click on any deploy
- **Analytics**: Site settings → Analytics (requires upgrade)
- **Functions logs**: If you add serverless functions later

---

## 🎉 You're All Set!

Your Fitness Journal is now:
- ✅ Version controlled with Git
- ✅ Hosted on GitHub
- ✅ Automatically deployed via Netlify
- ✅ Live on the internet with HTTPS
- ✅ Ready for continuous updates

**Next Steps**:
1. Share your app URL with friends
2. Make improvements and push updates
3. Watch Netlify automatically deploy changes
4. Track your fitness journey!

---

**Need Help?**
- [Netlify Docs](https://docs.netlify.com)
- [GitHub Docs](https://docs.github.com)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)

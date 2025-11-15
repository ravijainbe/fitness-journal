# Deploy to GitHub Pages (100% Free)

## Quick Setup (5 Minutes)

### Step 1: Push Your Code to GitHub

If you haven't already pushed your code:

```bash
cd fitness-journal

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add your GitHub repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/fitness-journal.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. **Go to your repository on GitHub**:
   - `https://github.com/YOUR_USERNAME/fitness-journal`

2. **Click on "Settings"** (top right of repository page)

3. **Click "Pages"** in the left sidebar

4. **Under "Source"**:
   - Select branch: `main`
   - Select folder: `/ (root)`
   - Click **Save**

5. **Wait 1-2 minutes** for deployment

6. **Your site will be live at**:
   - `https://YOUR_USERNAME.github.io/fitness-journal/`

### Step 3: Verify It Works

Visit your GitHub Pages URL and test:
- ✅ Dashboard loads
- ✅ Log activities
- ✅ Create goals
- ✅ Data persists in IndexedDB

## That's It! 🎉

Your app is now deployed for FREE with:
- ✅ Unlimited bandwidth
- ✅ No credit limits
- ✅ Automatic HTTPS
- ✅ Global CDN

## Future Updates

To deploy updates:

```bash
# Make your changes
# ... edit files ...

# Commit and push
git add .
git commit -m "Update feature"
git push origin main
```

GitHub Pages will automatically update in 1-2 minutes!

## Custom Domain (Optional)

1. Go to Settings → Pages
2. Enter your custom domain
3. Configure DNS with your domain provider:
   - Add CNAME record pointing to `YOUR_USERNAME.github.io`

## Troubleshooting

**Site not loading?**
- Wait 2-3 minutes after enabling Pages
- Check Settings → Pages for the green checkmark
- Verify your index.html is in the root directory

**404 errors?**
- Make sure branch is set to `main`
- Ensure folder is set to `/ (root)`

**Need to disable?**
- Settings → Pages → Source → Select "None"

---

## Why GitHub Pages?

- **100% Free** - No credit limits, no bandwidth caps
- **Simple** - Just push to GitHub, it deploys automatically
- **Reliable** - Backed by GitHub's infrastructure
- **Fast** - Global CDN included
- **Secure** - Automatic HTTPS

No more Netlify credit warnings! 🚀

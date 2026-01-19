# Deploy to Vercel - Manual Instructions

Since the CLI login requires interactive input, here are two easy ways to deploy:

## Option A: Deploy via Vercel Website (Recommended - Easiest!)

### Step 1: Push to GitHub (if not already)
```bash
# Initialize git if needed
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/unplug.git
git push -u origin main
```

### Step 2: Deploy via Vercel Dashboard
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Import your GitHub repository (`unplug`)
5. Vercel will auto-detect Next.js - click **"Deploy"**

### Step 3: Add Environment Variables
After deployment:
1. Go to your project in Vercel
2. **Settings** → **Environment Variables**
3. Add these variables:

```
NEXT_PUBLIC_WEB3_STORAGE_TOKEN
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
NEXT_PUBLIC_DATA_VAULT_ADDRESS
NEXT_PUBLIC_PERMISSION_MANAGER_ADDRESS
NEXT_PUBLIC_MICRO_ECONOMY_ADDRESS
NEXT_PUBLIC_ACCESS_CONTROL_ADDRESS
```

4. **Redeploy** after adding variables

**That's it!** Your app will be live with automatic deployments on every push.

---

## Option B: Complete CLI Login (Alternative)

If you want to use CLI, you need to complete the browser authentication:

1. **Open the URL in your browser**: 
   ```
   https://vercel.com/oauth/device?user_code=CJHM-WBMP
   ```
   (Use the code from your terminal)

2. **Authorize** the CLI in your browser

3. **Press ENTER** in the terminal after authorization

4. Then deploy:
   ```bash
   vercel --prod
   ```

---

## Option C: Use Vercel Token (Advanced)

If you have a Vercel token:

```bash
# Set token as environment variable
export VERCEL_TOKEN=your_token_here

# Then deploy
vercel --prod --token=$VERCEL_TOKEN
```

To get a token:
1. Go to https://vercel.com/account/tokens
2. Create new token
3. Copy and use it

---

## Quick Comparison

| Method | Ease | Setup Time | Auto-Deploy |
|--------|------|------------|-------------|
| **Website (Git)** | ⭐⭐⭐⭐⭐ | 2 minutes | ✅ Yes |
| CLI Login | ⭐⭐⭐ | 5 minutes | ❌ Manual |
| Token | ⭐⭐⭐⭐ | 3 minutes | ❌ Manual |

**Recommendation**: Use **Option A (Website)** - it's the easiest and gives you automatic deployments!


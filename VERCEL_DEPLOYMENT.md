# Vercel Deployment Guide

## Quick Deploy

```bash
# 1. Login to Vercel (if not already logged in)
vercel login

# 2. Deploy to preview
vercel

# 3. Deploy to production
vercel --prod
```

## Deployment Steps

### Step 1: Login (Interactive)
Run `vercel login` - this will open your browser to authenticate.

### Step 2: Initial Deployment
Run `vercel` - this will:
- Detect Next.js automatically
- Ask for project settings (just press Enter for defaults)
- Deploy to a preview URL

### Step 3: Set Environment Variables
In Vercel Dashboard or via CLI:

```bash
# Via CLI
vercel env add NEXT_PUBLIC_WEB3_STORAGE_TOKEN
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
vercel env add NEXT_PUBLIC_DATA_VAULT_ADDRESS
vercel env add NEXT_PUBLIC_PERMISSION_MANAGER_ADDRESS
vercel env add NEXT_PUBLIC_MICRO_ECONOMY_ADDRESS
vercel env add NEXT_PUBLIC_ACCESS_CONTROL_ADDRESS
```

Or in Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add each variable for Production, Preview, and Development

### Step 4: Deploy to Production
```bash
vercel --prod
```

## Environment Variables to Set

Required for full functionality:

```env
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_web3_storage_token
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_DATA_VAULT_ADDRESS=0x...
NEXT_PUBLIC_PERMISSION_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_MICRO_ECONOMY_ADDRESS=0x...
NEXT_PUBLIC_ACCESS_CONTROL_ADDRESS=0x...
```

## What Gets Deployed

- ✅ Optimized production build
- ✅ Static assets
- ✅ Server-side rendering
- ✅ Automatic HTTPS
- ✅ Global CDN

## Post-Deployment

1. Visit your Vercel deployment URL
2. Test wallet connection
3. Verify environment variables are working
4. Check browser console for any errors

## Troubleshooting

**Build fails?**
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify Node.js version (Vercel auto-detects)

**Environment variables not working?**
- Ensure they start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding variables: `vercel --prod`

**Need to update?**
Just push to Git (if connected) or run `vercel --prod` again


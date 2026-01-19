# Deployment Guide

This guide covers deploying Unplug Data Vault to production.

## Prerequisites

- Node.js 18+ installed
- Vercel account (free tier works) or your preferred hosting platform
- Web3.Storage account and API token
- WalletConnect Project ID
- Deployed smart contracts (on mainnet or testnet)

## Option 1: Deploy to Vercel (Recommended)

Vercel offers seamless Next.js deployment with automatic HTTPS and CDN.

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Deploy

```bash
# Login to Vercel
vercel login

# Deploy (will prompt for configuration)
vercel

# For production deployment
vercel --prod
```

### Step 3: Set Environment Variables

In Vercel dashboard (or via CLI):

```bash
vercel env add NEXT_PUBLIC_WEB3_STORAGE_TOKEN
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
vercel env add NEXT_PUBLIC_DATA_VAULT_ADDRESS
vercel env add NEXT_PUBLIC_PERMISSION_MANAGER_ADDRESS
vercel env add NEXT_PUBLIC_MICRO_ECONOMY_ADDRESS
vercel env add NEXT_PUBLIC_ACCESS_CONTROL_ADDRESS
vercel env add NEXT_PUBLIC_NETWORK
vercel env add NEXT_PUBLIC_CHAIN_ID
```

### Step 4: Deploy from Git (Optional)

1. Connect your GitHub/GitLab repository to Vercel
2. Vercel will auto-deploy on every push
3. Set environment variables in Vercel dashboard

## Option 2: Deploy to Traditional Hosting

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### Deploy

1. **Node.js Server**: Run `npm start` on your server
2. **Static Export**: Use `npm run build && npm run export` (if configured)
3. **Docker**: Use the Dockerfile (create one if needed)

### Environment Variables

Set environment variables on your hosting platform:

```env
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_token
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_DATA_VAULT_ADDRESS=0x...
NEXT_PUBLIC_PERMISSION_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_MICRO_ECONOMY_ADDRESS=0x...
NEXT_PUBLIC_ACCESS_CONTROL_ADDRESS=0x...
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_CHAIN_ID=1
```

## Smart Contract Deployment

Before deploying the frontend, deploy your smart contracts:

### Testnet Deployment

```bash
# Set network in hardhat.config.js or .env
npm run deploy:testnet
```

### Mainnet Deployment

```bash
# Add mainnet config to hardhat.config.js
# Set MAINNET_RPC_URL and PRIVATE_KEY in .env
hardhat run scripts/deploy.js --network mainnet
```

After deployment, update environment variables with contract addresses.

## Domain Configuration

### Custom Domain (Vercel)

1. Add domain in Vercel dashboard
2. Update DNS records as instructed
3. SSL certificates are automatically provisioned

### Environment-Specific Configuration

For different environments (staging, production):

- **Staging**: Use testnet contracts, staging API keys
- **Production**: Use mainnet contracts, production API keys

## Performance Optimization

The production build includes:

- ✅ Code splitting
- ✅ Image optimization
- ✅ CSS minification
- ✅ Tree shaking
- ✅ Automatic static optimization

## Monitoring

Consider adding:

- **Error Tracking**: Sentry, LogRocket
- **Analytics**: Vercel Analytics, Google Analytics
- **Uptime Monitoring**: UptimeRobot, Pingdom

## Security Checklist

Before production:

- [ ] Environment variables secured (not in git)
- [ ] Smart contracts audited
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] API keys rotated if exposed
- [ ] Error messages don't leak sensitive info
- [ ] CORS configured correctly

## Troubleshooting

### Build Fails

- Check Node.js version (18+)
- Clear `.next` folder and `node_modules`, reinstall
- Check for TypeScript errors: `npm run lint`

### Runtime Errors

- Verify environment variables are set
- Check browser console for errors
- Verify contract addresses are correct
- Ensure network matches contract deployment

### IPFS Upload Issues

- Verify Web3.Storage token is valid
- Check API quota at web3.storage
- Verify file size limits

## Continuous Deployment

### GitHub Actions (Example)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Post-Deployment

1. Test all functionality
2. Verify wallet connections work
3. Test file upload/download
4. Verify permissions work correctly
5. Test payment flows (on testnet first)

## Support

For deployment issues:
- Check Vercel/your hosting platform logs
- Review browser console for client-side errors
- Check smart contract deployment logs


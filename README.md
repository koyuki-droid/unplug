# Unplug - Self-Custody Data Vault

A blockchain-based, self-custody data vault that enables users to control their personal data (medical records, personal files, etc.) with time-limited permissions, signature-based authentication, and a micro-economy system for data monetization.

## Features

- 🔐 **Browser-Based Wallet**: Similar to MetaMask, easy plugin/connect to any platform
- 📋 **Medical Records Storage**: Store and manage personal medical records
- ✅ **Time-Limited Permissions**: Grant access with automatic expiration and revocation
- ✍️ **Signature-Based Auth**: Cryptographic signatures for all access requests (like MetaMask)
- 🤝 **Counter-Party Uploads**: Approved parties (hospitals, clinics) can upload records with permission
- 💰 **Micro-Economy**: Monetize your data by granting time-limited access to AI companies
- 🔒 **Self-Custody**: You own and control your data completely
- 🌐 **Immutable & Censorship-Resistant**: Built on blockchain with IPFS for decentralized storage
- 🎨 **Super Slick UI**: Gen X-friendly design that anyone can use

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS, Framer Motion
- **Blockchain**: Ethereum (Solidity), Hardhat
- **Wallet**: Wagmi, RainbowKit, Ethers.js
- **Storage**: IPFS (via Web3.Storage)
- **Smart Contracts**: OpenZeppelin

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible wallet

### Installation

```bash
npm install
```

### Development

```bash
# Start local blockchain (in one terminal)
npx hardhat node

# Deploy contracts (in another terminal)
npm run deploy:local

# Start frontend (in another terminal)
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Project Structure

```
unplug/
├── app/                    # Next.js app directory
├── components/             # React components
├── contracts/              # Solidity smart contracts
├── lib/                    # Utilities and hooks
├── public/                 # Static assets
└── scripts/                # Deployment scripts
```

## Smart Contracts

- **DataVault.sol**: Main vault contract for data management
- **PermissionManager.sol**: Handles time-limited permissions
- **MicroEconomy.sol**: Payment system for data access
- **AccessControl.sol**: Signature-based access control

## License

MIT


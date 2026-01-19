# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │   Upload     │  │  Permissions │     │
│  │  Component   │  │  Component   │  │  Component   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
│                    ┌───────▼────────┐                       │
│                    │  Wallet Layer  │                       │
│                    │  (Wagmi/       │                       │
│                    │   RainbowKit)  │                       │
│                    └───────┬────────┘                       │
└────────────────────────────┼────────────────────────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
        ┌───────▼────┐  ┌───▼────┐  ┌───▼─────┐
        │  Ethereum  │  │  IPFS  │  │ Signing │
        │ Blockchain │  │Storage │  │  (ECDSA)│
        └────────────┘  └────────┘  └─────────┘
                │
        ┌───────▼────────────────────────┐
        │    Smart Contracts             │
        │  ┌──────────────┐             │
        │  │  DataVault   │             │
        │  └──────┬───────┘             │
        │         │                     │
        │  ┌──────▼────────┐            │
        │  │ Permission    │            │
        │  │ Manager       │            │
        │  └──────┬───────┘             │
        │         │                     │
        │  ┌──────▼────────┐            │
        │  │ MicroEconomy  │            │
        │  └──────┬───────┘             │
        │         │                     │
        │  ┌──────▼────────┐            │
        │  │ AccessControl │            │
        │  └───────────────┘            │
        └───────────────────────────────┘
```

## Data Flow

### 1. Upload Flow

```
User → Select File → Encrypt (TODO) → IPFS Upload → Get CID
→ Smart Contract Call → DataVault.uploadData(CID, dataType)
→ Transaction Signed → Blockchain Record
```

### 2. Permission Granting Flow

```
User → Enter Grantee + Record ID + Duration → Create Signature Message
→ User Signs (MetaMask-style) → PermissionManager.grantPermission(signature)
→ Permission Stored on Blockchain → Auto-expires at expiryTime
```

### 3. Micro-Economy Flow

```
User → Grant "AI Access" Permission → AI Company Creates Agreement
→ MicroEconomy.createAgreement(payment terms) → Periodic Payments
→ Accumulate Balance → User Withdraws → Permission Auto-Expires
```

## Smart Contract Architecture

### DataVault.sol
- **Purpose**: Store data metadata and IPFS hashes on-chain
- **Key Functions**:
  - `uploadData(ipfsHash, dataType)`: Owner uploads data
  - `uploadDataForOwner(owner, ipfsHash, dataType)`: Authorized party uploads
  - `deleteData(recordId)`: Soft delete (deactivate)

### PermissionManager.sol
- **Purpose**: Manage time-limited permissions with signature verification
- **Key Functions**:
  - `grantPermission(...signature)`: Grant with MetaMask-style signature
  - `revokePermission(permissionId)`: Revoke before expiry
  - `isValidPermission(permissionId)`: Check if permission is active

### MicroEconomy.sol
- **Purpose**: Handle payments for data access
- **Key Functions**:
  - `createAgreement(...payment terms)`: Create payment agreement
  - `makePayment(agreementId)`: Make periodic payment
  - `withdraw()`: Withdraw accumulated balance

### AccessControl.sol
- **Purpose**: Central coordinator for access validation
- **Key Functions**:
  - `hasAccess(recordId, requester, permissionType)`: Check access
  - `uploadDataWithPermission(...)`: Validate permission before upload

## Security Model

### 1. Self-Custody
- Users control their private keys
- No central authority can access user data
- Data ownership verified on-chain

### 2. Encryption (TODO)
- Files encrypted before IPFS upload
- Only permissioned parties can decrypt
- User controls encryption keys

### 3. Permission System
- Time-limited permissions (auto-expire)
- Signature-based (MetaMask-style)
- Revocable by owner

### 4. Immutability
- Blockchain records are immutable
- IPFS provides decentralized, persistent storage
- Censorship-resistant

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **TailwindCSS**: Styling (Gen X-friendly design)
- **Framer Motion**: Animations
- **Wagmi + RainbowKit**: Wallet integration

### Blockchain
- **Ethereum**: Blockchain network
- **Solidity 0.8.20**: Smart contract language
- **Hardhat**: Development environment
- **OpenZeppelin**: Security-audited contracts

### Storage
- **IPFS**: Decentralized storage via Web3.Storage
- **Web3.Storage**: IPFS pinning service

### Wallet
- **MetaMask**: Primary wallet
- **ECDSA Signatures**: Permission signing
- **RainbowKit**: Wallet connection UI

## Key Design Decisions

1. **IPFS for Storage**: Decentralized, immutable, censorship-resistant
2. **Smart Contracts for Metadata**: On-chain record of data ownership and permissions
3. **Time-Limited Permissions**: Auto-expiring access (security + privacy)
4. **Signature-Based Auth**: MetaMask-style signing (familiar UX)
5. **Micro-Economy**: Native payment support for data monetization

## Future Enhancements

1. **Client-Side Encryption**: Encrypt files before IPFS upload
2. **Access Logs**: Track who accessed what data when
3. **Multi-Chain Support**: Deploy to multiple blockchains
4. **Mobile App**: React Native version
5. **API Layer**: REST API for third-party integrations
6. **Data Categories**: Better organization and tagging
7. **Export/Import**: Backup and restore functionality

## File Structure

```
unplug/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page
│   ├── providers.tsx        # Wagmi/RainbowKit providers
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── Dashboard.tsx        # Main dashboard
│   ├── DataRecords.tsx      # Record list view
│   ├── UploadFile.tsx       # File upload UI
│   ├── GrantPermission.tsx  # Permission granting
│   ├── ActivePermissions.tsx # Permission list
│   ├── MicroEconomy.tsx     # Payment/earnings UI
│   └── WelcomeScreen.tsx    # Landing page
├── contracts/               # Solidity contracts
│   ├── DataVault.sol
│   ├── PermissionManager.sol
│   ├── MicroEconomy.sol
│   ├── AccessControl.sol
│   └── addresses.json       # Deployed addresses
├── lib/                     # Utilities
│   ├── contracts.ts         # Contract interaction helpers
│   └── ipfs.ts              # IPFS upload/download
└── scripts/                 # Deployment scripts
    └── deploy.js            # Contract deployment
```

## Deployment Flow

1. **Local Development**:
   - Hardhat local node
   - Test with local accounts

2. **Testnet Deployment**:
   - Deploy to Sepolia/Ethereum testnet
   - Test with testnet ETH

3. **Mainnet Deployment**:
   - Deploy to Ethereum mainnet
   - Production use with real ETH

## API Integration Points

The system can integrate with external services:
- **Hospitals**: Upload medical records via API
- **AI Companies**: Access data via permissioned API
- **Data Marketplaces**: List and sell data access

Future API endpoints (to be implemented):
- `POST /api/upload` - Upload data
- `GET /api/records/:id` - Get record metadata
- `POST /api/permissions` - Grant permission
- `GET /api/permissions/:id` - Check permission status
- `POST /api/payments` - Create payment agreement


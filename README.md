# ReputeChain 

> Full-Stack Decentralized Reputation System

ReputeChain is a fully integrated Web3 application that bridges traditional Web2 identities (GitHub, LinkedIn, Upwork) with immutable Web3 Blockchain attestations. 

## 🌟 Features Implemented

1. **Authentication (JWT)**
   - Secure User Registration and Login using proper backend password hashing (bcrypt).
   - Global App Auth State (`DataContext.tsx`) with automatic token expiration handling.
2. **MetaMask Wallet Connection**
   - Implemented via `ethers.js` in a custom `useWeb3.ts` hook.
   - Global **Connect Wallet** button in the Navbar and Hero Section that automatically syncs the user's live blockchain address to their backend database profile.
3. **Data Fetch & Score Rating**
   - The backend `reputation.service.ts` actively fetches data from external APIs (like GitHub) to calculate a dynamic reputation score (0-1000).
4. **Blockchain Data Storage (Solidity)**
   - `ReputeChain.sol` Smart Contract manages the reputation data.
   - Users can click **"Anchor Score on Blockchain"** on their dashboard. The frontend triggers an API request to the backend, which securely signs and publishes the transaction to the Ethereum network.
5. **Verify Blockchain Properly**
   - The **On-Chain Verification** section dynamically retrieves the live `getAttestation()` data from the smart contract, proving cryptographically that the user's score was recorded at a specific timestamp by the admin issuer.
6. **Backend + Frontend API Connection**
   - The React frontend uses Vite's proxy to seamlessly route `/api/` requests to the Node.js/Express backend running on port 3000.

---

## 🚀 How to Run the Complete System

The system requires three separate environments to run simultaneously. You currently have all three running!

### 1. The Blockchain (Ganache)
A local Ethereum node simulates the blockchain environment without needing real ETH.
```bash
cd backend
npx ganache --wallet.accounts="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80,1000000000000000000000"
```
*(The smart contract was deployed to this local network via `scripts/deploy.js`)*

### 2. The Backend Server (API & Web3)
Handles JWT Authentication, Database (MongoDB), Reputation Calculations, and signs transactions.
```bash
cd backend
npm run dev
```

### 3. The Frontend (React Web App)
The user interface where you connect MetaMask and interact with your dashboard.
```bash
npm run dev
```

---

## 🔗 Project Structure Overview

```text
reputechain/
├── backend/                       # Node.js + Express Backend
│   ├── contracts/
│   │   └── ReputeChain.sol        # The Solidity Smart Contract
│   ├── scripts/
│   │   ├── deploy.js              # Deploys contract to Ganache
│   │   └── interact.js            # Node script for direct Blockchain reads
│   ├── src/
│   │   ├── controllers/           # API endpoints (Auth, User, Reputation)
│   │   ├── models/                # MongoDB Schemas
│   │   ├── services/
│   │   │   └── web3.service.ts    # Backend ethers.js blockchain connection
│   │   └── app.ts                 # Express Setup
│   └── .env                       # Stores Database URI, Private Key, and Contract Address
│
└── src/                           # React + Vite Frontend
    ├── components/
    │   └── reputechain/           # UI Components (Navbar, Dashboard, Profile)
    ├── hooks/
    │   └── useWeb3.ts             # React Hook for connecting to MetaMask
    ├── context/
    │   └── DataContext.tsx        # Global State for API data & Auth
    └── pages/
        ├── Index.tsx              # Landing Page & Dashboard Layout
        └── Login.tsx              # Authentication Page
```

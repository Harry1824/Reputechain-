# ReputeChain Backend

Production-ready backend for the ReputeChain platform. Aggregates professional reputation data from multiple platforms, computes a composite reputation score, and anchors it on-chain as a verifiable attestation.

## Tech Stack
- **Node.js + Express** (RESTful API)
- **TypeScript** (Strict mode)
- **MongoDB + Mongoose** (Database)
- **JWT** (Authentication)
- **Ethers.js** (Ethereum Blockchain interaction)
- **Pinata (IPFS)** (Decentralized metadata storage)
- **Docker** (Containerization)
- **Swagger** (API Documentation)
- **Jest** (Unit testing)

## Prerequisites
- Node.js v18+
- MongoDB instance running locally (or use Docker)
- IPFS Pinata API Keys (optional but recommended for production)
- Ethereum Private Key (with some Sepolia/Goerli ETH for testnet deployment)

## Setup & Installation
1. Clone the project or navigate to the folder:
   ```bash
   cd reputechain/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env` file and fill in your keys:
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure you add a valid `MONGO_URI`, `GITHUB_ACCESS_TOKEN`, `PRIVATE_KEY` and `PINATA_API_KEY` for full functionality.*

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Running with Docker
You can easily spin up the API and MongoDB using docker-compose:
```bash
docker-compose up --build
```

## API Documentation
Once the server is running (default port `3000`), visit the Swagger UI at:
- `http://localhost:3000/api-docs`

## Core Workflows
1. **User Registers/Logs in**: `POST /api/auth/register` to receive Access & Refresh Tokens.
2. **Connect GitHub**: `POST /api/user/connect/github` connects their GitHub and aggregates initial data.
3. **Connect LinkedIn/Upwork**: `PATCH /api/user/profile` (Using simulated endpoints logic).
4. **Calculate Reputation**: `GET /api/reputation/calculate` generates a composite score based on the aggregated professional data.
5. **Anchor & Attest**: `POST /api/reputation/anchor` hashes the calculated JSON metadata, saves it to IPFS, and signs an Ethereum transaction anchoring the reputation on-chain.
6. **Verify Attestation**: `GET /api/reputation/attestation/:walletAddress` retrieves the immutable attestation directly from the blockchain.

## Testing
Run unit tests using Jest:
```bash
npm test
```

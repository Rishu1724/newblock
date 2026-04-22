# newblock

A blockchain-based certificate verification system.

## Project Structure

- **blockchain/**: Hardhat environment, smart contracts, and deployment scripts.
- **frontend/**: React + Vite + Tailwind CSS application.

## Getting Started

### Prerequisites
- Node.js
- MetaMask extension

### Setup

1. **Install dependencies:**
   ```bash
   cd blockchain && npm install
   cd ../frontend && npm install
   ```

2. **Run local blockchain:**
   ```bash
   cd blockchain
   npx hardhat node
   ```

3. **Deploy contract:**
   ```bash
   cd blockchain
   npx hardhat run scripts/deploy.js --network localhost
   ```

4. **Run frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

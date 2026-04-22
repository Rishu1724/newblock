# 🚀 Quick Start Guide for Friends

To run this project on your computer, follow these exact steps.

## 1. Prerequisites
- Install [Node.js](https://nodejs.org/)
- Install [MetaMask](https://metamask.io/) extension in your browser.

## 2. Setup & Installation
Open your terminal in the project root folder and run:

### **Part A: Blockchain (The Backend)**
1. Navigate to the blockchain folder:
   ```bash
   cd blockchain
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local blockchain node:
   ```bash
   npx hardhat node
   ```
   *Keep this terminal open! It will give you a list of Accounts and Private Keys.*

### **Part B: Deploy the Contract**
1. Open a **new terminal** window.
2. Navigate to the blockchain folder:
   ```bash
   cd blockchain
   ```
3. Deploy the smart contract to your local node:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

### **Part C: Frontend (The Website)**
1. Open a **third terminal** window.
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the website:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## 3. Connect MetaMask
1. Open MetaMask and click the network selector (top left).
2. Click **Add Network** > **Add a network manually**.
3. Enter these details:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
4. **Import Account**:
   - Go to your **first terminal** (where you ran `npx hardhat node`).
   - Copy the **Private Key** of "Account #0".
   - In MetaMask: Click your profile icon > **Import Account** > Paste the key.

---

## 4. Critical MetaMask Settings (Important!)
To avoid "Transaction Failed" or "Nonce" errors, your friend **must** do this if they restart the blockchain:

### **A. Resetting the Account (If transactions get stuck)**
If they see an error like "Nonce too high" or transactions won't send:
1. Open MetaMask.
2. Go to **Settings** > **Advanced**.
3. Scroll down and click **"Clear activity tab data"** (previously "Reset Account").
   - *This won't lose their money; it just clears the history so the blockchain doesn't get confused.*

### **B. Enable Test Networks**
If they want to use **Sepolia**:
1. Go to **Settings** > **Advanced**.
2. Toggle **"Show test networks"** to **ON**.

---

## 5. Troubleshooting
- **Chain ID error?** Make sure `npx hardhat node` is actually running.
- **Contract not found?** Ensure you ran the deploy script in Step 2.
- **Wrong Network?** Ensure MetaMask is set to "Hardhat Local".

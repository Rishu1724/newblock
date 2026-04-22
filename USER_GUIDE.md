# 🎓 Certificate Verification App - User Guide

If you want to use this app on your own laptop to issue or verify certificates, follow these simple steps.

## 1. Prerequisites
- **Google Chrome** (recommended)
- **MetaMask Extension**: [Install here](https://metamask.io/download/)

## 2. Setup MetaMask
1.  **Open MetaMask** and create an account if you don't have one.
2.  **Switch to Sepolia Network**:
    - Click the network selector (top left).
    - Toggle **"Show test networks"** to **ON**.
    - Select **Sepolia**.
3.  **Get Test ETH**:
    - You need "Test ETH" to pay for transactions (it's free).
    - Go to a [Sepolia Faucet](https://sepoliafaucet.com/) and enter your wallet address.

## 3. How to Run the App
Once you have the project files:
1.  **Open your terminal** (Command Prompt or Terminal).
2.  Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
3.  **Install dependencies** (only the first time):
    ```bash
    npm install
    ```
4.  **Start the app**:
    ```bash
    npm run dev
    ```
5.  **Open the link**: Copy the URL (usually `http://localhost:5173`) and paste it into your browser.

## 4. Using the App
- **Connect Wallet**: Click the "Connect Wallet" button in the app.
- **Issue Certificate**: Fill in the student details and click "Issue". Confirm the transaction in MetaMask.
- **Verify**: Enter a Certificate ID to see the official, blockchain-verified certificate.

---
*Note: This app is currently running on the Sepolia Testnet. No real money is required.*

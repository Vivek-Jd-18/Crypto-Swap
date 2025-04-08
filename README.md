Absolutely! Here's your updated **README.md** with the demo video included:

---

```markdown
# 🪙 Crypto Swap Interface (Next.js + KyberSwap + MetaMask)

This is a simple crypto token swap demo interface built using **Next.js**, **KyberSwap Aggregator API**, and **MetaMask**. The app supports Ethereum and Binance Smart Chain (BSC) networks and allows users to connect their MetaMask wallet, select tokens, and perform a token swap.

> ⚠️ This is a live **mainnet demo** — you need real tokens in your MetaMask wallet for swaps to execute successfully.

---

## 🎥 Demo Video

Watch the live demo of the app in action:

📺 **[Click here to view the video](https://drive.google.com/file/d/1GCzURs4k1yYfw5JOmxK9wz6JdnC4Pe_m/view?usp=sharing)**

---

## 🚀 Features

- Swap tokens across Ethereum and BSC
- Live quote fetching via KyberSwap API
- MetaMask integration (wallet connect)
- Token amount input and auto-calculated estimated output
- Responsive, minimal UI with TailwindCSS and shadcn/ui
- Full swap execution on mainnet (if real tokens exist)

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:Vivek-Jd-18/ezi-pay-wallet-blockchain.git
cd ezi-pay-wallet-blockchain
```

### 2. Install Dependencies

Make sure you have **Node.js** and **npm** installed.

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

This will start your Next.js app at `http://localhost:3000`.

---

## 🌐 Browser Requirements

- Install the [MetaMask](https://metamask.io/download/) extension in your browser.
- Ensure your MetaMask wallet is connected to:
  - **Ethereum Mainnet** or
  - **Binance Smart Chain Mainnet**
- Have real tokens (like ETH, BNB, USDT, etc.) in your MetaMask wallet for successful swaps.

> **Note**: This demo does not use testnets — swaps will **only execute** if you have **actual mainnet tokens** in your wallet. Please proceed with caution and at your own risk.

---

## 🔄 How It Works

1. Connect your MetaMask wallet using the **Connect Wallet** button.
2. Select the blockchain network (Ethereum / BSC).
3. Choose tokens you want to swap **from** and **to**.
4. Enter the amount to swap — an estimated output will be displayed.
5. Click **Swap** and confirm the transaction in MetaMask.
6. Wait for the transaction to confirm on the blockchain.

---

## 📁 Project Structure (Highlights)

```bash
/pages
  └── index.tsx          # Main Crypto Swap component
/components
  ├── header.tsx         # Header with wallet info
  ├── wallet.tsx         # MetaMask integration hook
/hooks
  └── useSwap.ts         # Quote fetcher and swap logic
/constants
  └── constant.ts        # Predefined token lists
/services
  └── evmNetworks.ts     # Supported chain mapping
```

---

## ⚠️ Disclaimer

This app is for educational/demo purposes only. It interacts with live blockchain networks and real tokens. Use with caution. The author is not responsible for any loss of funds.

---

## 📬 Feedback / Contribution

Feel free to fork the repo, open issues, or submit pull requests if you find bugs or have suggestions to improve the interface!

---

## 🧑‍💻 Author

**Vivek Dhage**

---

## 📜 License

[MIT](./LICENSE)
```

---

Let me know if you want me to convert this into a styled `README.md` file and download it for you.
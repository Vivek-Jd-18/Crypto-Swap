export const EVMNetwork = {
  ethereum: {
    chainId: "0x1",
    name: "Ethereum",
    logoURI:
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Ethereum_logo.svg", // ✅ Clean
  },
  bsc: {
    chainId: "0x38",
    name: "Binance Smart Chain",
    logoURI:
      "https://upload.wikimedia.org/wikipedia/commons/e/e8/Binance_Logo.svg", // ✅ Clean
  },
} as const;

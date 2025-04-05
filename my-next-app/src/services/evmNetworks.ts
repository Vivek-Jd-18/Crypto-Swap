export enum EVMNetwork {
  ETHEREUM_MAINNET = "Ethereum Mainnet",
  ETHEREUM_SEPOLIA = "Ethereum Sepolia",
  ETHEREUM_HOLESKI = "Ethereum Holeski",
  POLYGON_MAINNET = "Polygon Mainnet",
  POLYGON_ZKEVM = "Polygon zkEVM",
  LINEA_MAINNET = "Linea Mainnet",
  LINEA_SEPOLIA = "Linea Sepolia",
  BASE_MAINNET = "Base Mainnet",
  BASE_SEPOLIA = "Base Sepolia",
  BNB_MAINNET = "BNB Mainnet",
  BNB_TESTNET = "BNB Testnet",
}

export const getRpcUrl = (network: EVMNetwork): string => {
  switch (network) {
    case EVMNetwork.ETHEREUM_MAINNET:
      return process.env.ALCHEMY_ETH_MAIN_NET_RPC!;
    case EVMNetwork.ETHEREUM_SEPOLIA:
      return process.env.ALCHEMY_ETH_SEPOLIA_RPC!;
    case EVMNetwork.ETHEREUM_HOLESKI:
      return process.env.ALCHEMY_ETH_HOLESKY_RPC!;
    case EVMNetwork.POLYGON_MAINNET:
      return process.env.ALCHEMY_POLYGON_MAINNET_RPC!;
    case EVMNetwork.POLYGON_ZKEVM:
      return process.env.ALCHEMY_POLYGON_ZKEVM_RPC!;
    case EVMNetwork.LINEA_MAINNET:
      return process.env.ALCHEMY_LINEA_MAINNET_RPC!;
    case EVMNetwork.LINEA_SEPOLIA:
      return process.env.ALCHEMY_LINEA_SEPOLIA_RPC!;
    case EVMNetwork.BASE_MAINNET:
      return process.env.ALCHEMY_BASE_MAINNET_RPC!;
    case EVMNetwork.BASE_SEPOLIA:
      return process.env.ALCHEMY_BASE_SEPOLIA_RPC!;
    case EVMNetwork.BNB_MAINNET:
      return process.env.ALCHEMY_BNB_MAINNET_RPC!;
    case EVMNetwork.BNB_TESTNET:
      return process.env.ALCHEMY_BNB_TESTNET_RPC!;
    default:
      throw new Error("Unsupported network");
  }
};

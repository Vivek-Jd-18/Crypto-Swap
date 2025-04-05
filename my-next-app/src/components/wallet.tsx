"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { EVMNetwork } from "@/services/evmNetworks";

type SupportedNetwork = keyof typeof EVMNetwork; // 'ethereum' | 'bsc'

export const useWallet = (initialChain: SupportedNetwork) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedChain, setSelectedChain] =
    useState<SupportedNetwork>(initialChain);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChainChange = async (chain: SupportedNetwork) => {
    if (!(chain in EVMNetwork)) {
      setError("Unsupported network");
      return;
    }

    const { chainId, name } = EVMNetwork[chain];
    const rpcUrl =
      chain === "bsc"
        ? "https://bsc-dataseed.binance.org"
        : "https://mainnet.infura.io/v3/YOUR_INFURA_KEY";

    setSelectedChain(chain);
    setError(null);

    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      setError("MetaMask not detected");
      return;
    }

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId,
                chainName: name,
                rpcUrls: [rpcUrl],
                nativeCurrency: {
                  name: chain === "bsc" ? "BNB" : "Ether",
                  symbol: chain === "bsc" ? "BNB" : "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: [
                  chain === "bsc"
                    ? "https://bscscan.com"
                    : "https://etherscan.io",
                ],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add chain", addError);
          setError("Failed to add network to MetaMask");
          return;
        }
      } else {
        console.error("Switch chain error", switchError);
        setError("Failed to switch network");
        return;
      }
    }

    const providerInstance = new ethers.BrowserProvider(ethereum);
    setProvider(providerInstance);
  };

  const connectWallet = async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      alert("MetaMask not detected");
      return;
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      await handleChainChange(selectedChain);
    } catch (error) {
      console.error("Wallet connect error", error);
      setError("Failed to connect wallet");
    }
  };

  return {
    walletAddress,
    selectedChain,
    provider,
    error,
    setError,
    handleChainChange,
    connectWallet,
  };
};

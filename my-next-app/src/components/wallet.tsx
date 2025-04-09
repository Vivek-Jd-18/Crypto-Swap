"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { EVMNetwork } from "@/services/evmNetworks";
import { getNetwork, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { getSigner, getWeb3Provider } from "@dynamic-labs/ethers-v6";

type SupportedNetwork = keyof typeof EVMNetwork;

export const useWallet = (initialChain: SupportedNetwork) => {
  const [selectedChain, setSelectedChain] =
    useState<SupportedNetwork>(initialChain);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { primaryWallet } = useDynamicContext();

  const connectWallet = async () => {
    if (!primaryWallet) {
      setError("No wallet connected");
      return;
    }

    try {
      const ethersProvider = await getWeb3Provider(primaryWallet);
      console.log("ethersProvider", ethersProvider);
      setProvider(ethersProvider); // ✅ now provider is ready
      setWalletAddress(primaryWallet.address || "");
    } catch (err) {
      console.error("Dynamic wallet connect error", err);
      setError("Failed to connect Dynamic wallet");
    }
  };

  const handleChainChange = async (chain: SupportedNetwork) => {
    if (!(chain in EVMNetwork)) {
      setError("Unsupported network");
      return;
    }

    setSelectedChain(chain);
    setError(null);

    try {
      const targetChainId = EVMNetwork[chain].chainId;

      const supportsSwitching =
        await primaryWallet?.connector?.supportsNetworkSwitching?.();

      if (supportsSwitching && primaryWallet) {
        await primaryWallet.switchNetwork(targetChainId);
        console.log("✅ Switched to network:", targetChainId);

        // ⬇️ Reconnect provider after switching
        await connectWallet();
      } else {
        console.warn("⚠️ Network switching not supported by this wallet.");
        setError("This wallet doesn't support network switching.");
      }
    } catch (err) {
      console.error("Switch network failed", err);
      setError("Failed to switch network.");
    }
  };

  useEffect(() => {
    if (primaryWallet) {
      primaryWallet.isConnected().then((connected) => {
        if (connected) {
          connectWallet();

          const fetchNetworkAndTokens = async () => {
            if (primaryWallet?.connector) {
              const network = await getNetwork(primaryWallet.connector);
              console.log("Current network:", network);
              if (network) {
                const parsedNetwork =
                  typeof network === "string" ? parseInt(network) : network;
                console.log("Current network:", parsedNetwork);
                if (parsedNetwork === EVMNetwork.bsc.chainId) {
                  setSelectedChain("bsc");
                }
                if (parsedNetwork === EVMNetwork.ethereum.chainId) {
                  setSelectedChain("ethereum");
                }
              }
            }
          };

          fetchNetworkAndTokens();
        } else {
          console.log("Wallet is not connected");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryWallet]);

  return {
    walletAddress,
    selectedChain,
    provider,
    error,
    setError,
    handleChainChange,
  };
};

"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { EVMNetwork, getRpcUrl } from "@/services/evmNetworks";

interface HeaderProps {
  walletAddress: string;
  selectedChain: EVMNetwork;
  provider: ethers.JsonRpcProvider | null;
}

const Header = ({ walletAddress, selectedChain, provider }: HeaderProps) => {
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (provider && walletAddress) {
        try {
          const balanceBigNumber = await provider.getBalance(walletAddress);
          const balanceInEther = ethers.formatEther(balanceBigNumber);
          setBalance(parseFloat(balanceInEther).toFixed(4));
        } catch (error) {
          console.error("Failed to fetch balance:", error);
        }
      }
    };

    fetchBalance();
  }, [provider, walletAddress]);

  return (
    <div className="sticky top-0 w-full p-4 bg-gray-800 shadow-md text-center text-white z-10">
      <h1 className="text-3xl font-bold mb-2">Crypto Swap</h1>
      <p>
        Wallet Address:{" "}
        <span className="font-mono text-green-400">
          {walletAddress || "Not Connected"}
        </span>
      </p>
      <p>
        Current Network:{" "}
        <span className="font-mono text-blue-400">
          {selectedChain === EVMNetwork.ETHEREUM_MAINNET ? "Ethereum Mainnet" : "Binance Smart Chain"}
        </span>
      </p>
      <p>
        Balance:{" "}
        <span className="font-mono text-yellow-400">
          {balance ? `${balance} ${selectedChain === EVMNetwork.ETHEREUM_MAINNET ? "ETH" : "BNB"}` : "Fetching..."}
        </span>
      </p>
    </div>
  );
};

export default Header;

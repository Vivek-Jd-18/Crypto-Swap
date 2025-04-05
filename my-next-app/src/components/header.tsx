"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { EVMNetwork } from "@/services/evmNetworks";

interface HeaderProps {
  walletAddress: string;
  selectedChain: keyof typeof EVMNetwork; // 'ethereum' | 'bsc'
  provider: ethers.BrowserProvider | null;
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

  const getChainLabel = (chain: keyof typeof EVMNetwork) =>
    chain === "ethereum" ? "Ethereum" : "BNB Chain";

  const getTokenSymbol = (chain: keyof typeof EVMNetwork) =>
    chain === "ethereum" ? "ETH" : "BNB";

  return (
    <div className="sticky top-0 w-full px-6 py-4 bg-gray-800 shadow-md text-white z-10">
      <div className="flex justify-between items-start w-full max-w-7xl mx-auto">
        <div className="text-2xl font-bold">Crypto Swap</div>

        {/* Center: Wallet Address */}
        <div className="text-sm font-mono text-green-400 text-center truncate max-w-[300px] mt-2">
          {walletAddress ? `Wallet: ${walletAddress}` : "Wallet not Connected"}
        </div>

        {/* Right: Network + Balance */}
        <div className="text-right text-sm space-y-1">
          {balance ? (
            <div>
              Network:{" "}
              <span className="font-mono text-blue-400">
                {getChainLabel(selectedChain)}
              </span>
            </div>
          ) : (
            <></>
          )}
          {balance ? (
            <div>
              Balance:{" "}
              <span className="font-mono text-yellow-400">
                {balance
                  ? `${balance} ${getTokenSymbol(selectedChain)}`
                  : "Not Connected"}
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

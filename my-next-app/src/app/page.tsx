"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, Card, CardContent, Input } from "@/components/ui";
import { EVMNetwork, getRpcUrl } from "@/services/evmNetworks";
import Header from "@/components/header";  // Importing the Header component

const CryptoSwap = () => {
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [selectedChain, setSelectedChain] = useState<EVMNetwork>(
    EVMNetwork.ETHEREUM_MAINNET
  );
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChainChange = async (chain: EVMNetwork) => {
    setSelectedChain(chain);
    const rpcUrl = getRpcUrl(chain);
    const providerInstance = new ethers.JsonRpcProvider(rpcUrl);
    setProvider(providerInstance);
  };

  const connectWallet = async () => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        handleChainChange(selectedChain);
      } catch (error) {
        setError("Failed to connect wallet");
      }
    } else {
      alert("MetaMask not detected");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Using the Header component */}
      <Header walletAddress={walletAddress} selectedChain={selectedChain} provider={provider} />

      <div className="flex flex-col items-center justify-center pt-8">
        <Card className="bg-gray-800 text-white">
          <CardContent>
            {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
            
            <select
              value={selectedChain}
              onChange={(e: any) => handleChainChange(e.target.value as EVMNetwork)}
              className="w-full mb-4 p-3 border rounded-xl shadow-sm focus:outline-none bg-gray-700 text-white"
            >
              <option value={EVMNetwork.ETHEREUM_MAINNET}>Ethereum</option>
              <option value={EVMNetwork.BNB_MAINNET}>Binance Smart Chain</option>
            </select>
            
            <Input 
              value={fromToken} 
              onChange={(e) => setFromToken(e.target.value)} 
              placeholder="From Token Address" 
              className="mb-4 bg-gray-700 text-white"
            />
            <Input 
              value={toToken} 
              onChange={(e) => setToToken(e.target.value)} 
              placeholder="To Token Address" 
              className="mb-4 bg-gray-700 text-white"
            />
            <Input 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="Amount" 
              className="mb-4 bg-gray-700 text-white"
            />

            <Button onClick={connectWallet} className="w-full mb-4">
              {walletAddress ? "Wallet Connected" : "Connect Wallet"}
            </Button>
            <Button className="w-full">Swap</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CryptoSwap;

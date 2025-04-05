"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, Button } from "@/components/ui";
import { EVMNetwork } from "@/services/evmNetworks";
import Header from "@/components/header";
import { useWallet } from "@/components/wallet";
import { eth_tokens, bnb_tokens } from "../constants/constant";
import { useSwap } from "@/hooks/useSwap";

const CryptoSwap = () => {
  const [tokens, setTokens] = useState(eth_tokens);
  const [fromToken, setFromToken] = useState(eth_tokens[0].address);
  const [toToken, setToToken] = useState(eth_tokens[1].address);
  const [amount, setAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);

  const {
    walletAddress,
    selectedChain,
    provider,
    error,
    setError,
    handleChainChange,
    connectWallet,
  } = useWallet("ethereum");

  const {
    amountOut,
    error: swapError,
    setError: setSwapError,
    handleSwap,
    fetchQuote,
  } = useSwap();

  // 👇 Custom handler to reset state on network change
  const onNetworkChange = (value: keyof typeof EVMNetwork) => {
    handleChainChange(value); // Original handler
    const newTokens = value === "bsc" ? bnb_tokens : eth_tokens;
    setTokens(newTokens);
    setFromToken(newTokens[0].address);
    setToToken(newTokens[1].address);
    setAmount("");
    setSwapError("");
  };

  const onSwap = async () => {
    if (!walletAddress || !provider) {
      setError("Connect your wallet first.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    try {
      setIsSwapping(true);
      await handleSwap({
        network: selectedChain,
        tokenIn: fromToken,
        tokenOut: toToken,
        amount,
        provider,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSwapping(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && /^\d*\.?\d*$/.test(value))) {
      setAmount(value);
    }
  };

  const swapSelectedTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  useEffect(() => {
    if (amount && fromToken && toToken && selectedChain && Number(amount) > 0) {
      fetchQuote({
        network: selectedChain,
        tokenIn: fromToken,
        tokenOut: toToken,
        amount,
      });
    } else {
      setSwapError("");
    }
  }, [amount, fromToken, toToken, selectedChain]);

  useEffect(() => {
    if (!amount || Number(amount) <= 0) {
      setSwapError("");
    }
  }, [amount]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (swapError) toast.error(swapError);
  }, [swapError]);

  const isAmountValid = amount && Number(amount) > 0;

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header
        walletAddress={walletAddress}
        selectedChain={selectedChain}
        provider={provider}
      />

      <div className="flex flex-col items-center justify-center pt-8">
        <Card className="bg-zinc-600 text-white w-[350px]">
          <CardContent>
            <label className="text-sm mb-1 text-gray-300">Select Chain</label>
            <select
              value={selectedChain}
              onChange={(e) =>
                onNetworkChange(e.target.value as keyof typeof EVMNetwork)
              }
              className="w-full mb-4 p-3 border rounded-xl bg-gray-700 text-white"
            >
              <option value="ethereum">Ethereum</option>
              <option value="bsc">Binance Smart Chain</option>
            </select>

            <label className="text-sm mb-1 text-gray-300">From Token</label>
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="w-full mb-4 p-3 border rounded-xl bg-gray-700 text-white"
            >
              {tokens.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>

            <div className="flex justify-center mb-4">
              <Button
                variant="ghost"
                className="bg-gray-700 text-white rounded-full px-4 py-2"
                onClick={swapSelectedTokens}
              >
                ⬆️⬇️
              </Button>
            </div>

            <label className="text-sm mb-1 text-gray-300">To Token</label>
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="w-full mb-4 p-3 border rounded-xl bg-gray-700 text-white"
            >
              {tokens.map((token) => (
                <option
                  key={token.address}
                  value={token.address}
                  disabled={token.address === fromToken}
                >
                  {token.symbol}
                </option>
              ))}
            </select>

            <label className="text-sm mb-1 text-gray-300">Amount</label>
            <input
              value={amount}
              onChange={handleAmountChange}
              placeholder="Amount"
              type="text"
              inputMode="decimal"
              className="w-full mb-4 p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400"
            />

            <label className="text-sm mb-1 text-gray-300">Estimated Out</label>
            <input
              value={isAmountValid ? amountOut : ""}
              placeholder="Estimated Out"
              disabled
              className="w-full mb-4 p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 opacity-70"
            />

            <Button
              onClick={connectWallet}
              className={`w-full mb-3 ${
                walletAddress ? "bg-gray-500 cursor-not-allowed" : ""
              }`}
              disabled={!!walletAddress}
            >
              {walletAddress ? "Wallet Connected" : "Connect Wallet"}
            </Button>

            <Button
              className={`w-full ${
                !isAmountValid || isSwapping
                  ? "bg-gray-500 cursor-not-allowed"
                  : ""
              }`}
              onClick={onSwap}
              disabled={!isAmountValid || isSwapping}
            >
              {isSwapping ? "Confirm in Wallet..." : "Swap"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CryptoSwap;

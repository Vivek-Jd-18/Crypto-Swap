"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, Button } from "@/components/ui";
import { EVMNetwork } from "@/services/evmNetworks";
import Header from "@/components/header";
import { useWallet } from "@/components/wallet";
import { useSwap } from "@/hooks/useSwap";
import axios from "axios";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

const CryptoSwap = () => {
  const [tokens, setTokens] = useState<any[]>([]);
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [slippage, setSlippage] = useState("0.01");

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

  const fetchTokens = async (chainId: number) => {
    try {
      const response = await axios.get(
        `https://ks-setting.kyberswap.com/api/v1/tokens`,
        {
          params: {
            page: 1,
            pageSize: 100,
            isWhitelisted: true,
            chainIds: chainId,
          },
        },
      );
      const tokenList = response.data.data.tokens;
      setTokens(tokenList);
      setFromToken(tokenList[0]?.address || "");
      setToToken(tokenList[1]?.address || "");
    } catch (err) {
      console.error("Failed to fetch tokens:", err);
      toast.error("Failed to load tokens.");
    }
  };

  const onNetworkChange = (value: keyof typeof EVMNetwork) => {
    handleChainChange(value);
    const chainId = value === "bsc" ? 56 : 1;
    fetchTokens(chainId);
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
        slippage,
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
    const defaultChainId = selectedChain === "bsc" ? 56 : 1;
    fetchTokens(defaultChainId);
  }, []);

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

  const getTokenDetails = (address: string) =>
    tokens.find((t) => t.address === address);

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
            <Listbox
              value={selectedChain}
              onChange={(val) =>
                onNetworkChange(val as keyof typeof EVMNetwork)
              }
            >
              <div className="relative">
                <Listbox.Button className="w-full p-3 border rounded-xl bg-gray-700 text-white flex items-center justify-between">
                  <span className="flex items-center gap-2 capitalize">
                    <img
                      src={EVMNetwork[selectedChain].logoURI}
                      alt={EVMNetwork[selectedChain].name}
                      className="w-4 h-4 rounded-full object-contain"
                    />
                    {EVMNetwork[selectedChain].name}
                  </span>
                  <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
                </Listbox.Button>

                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-gray-700 py-1 text-base text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {Object.entries(EVMNetwork).map(([key, network]) => (
                    <Listbox.Option
                      key={key}
                      value={key}
                      className={({ active }) =>
                        `cursor-pointer select-none relative py-2 px-4 ${
                          active ? "bg-gray-600" : ""
                        }`
                      }
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={network.logoURI}
                          alt={network.name}
                          className="w-4 h-4 rounded-full object-contain"
                        />
                        <span>{network.name}</span>
                      </div>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>

            {/* From Token */}
            <label className="text-sm mb-1 text-gray-300">From Token</label>
            <Listbox value={fromToken} onChange={setFromToken}>
              <div className="relative mb-4">
                <Listbox.Button className="w-full p-3 border rounded-xl bg-gray-700 text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getTokenDetails(fromToken)?.logoURI ? (
                      <img
                        src={getTokenDetails(fromToken)?.logoURI}
                        alt=""
                        className="w-5 h-5 rounded-full"
                      />
                    ) : null}
                    {getTokenDetails(fromToken)?.symbol}
                  </span>
                  <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-gray-700 py-1 text-base text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {tokens.map((token) => (
                    <Listbox.Option
                      key={token.address}
                      value={token.address}
                      className={({ active }) =>
                        `cursor-pointer select-none relative py-2 px-4 ${
                          active ? "bg-gray-600" : ""
                        }`
                      }
                    >
                      <div className="flex items-center gap-2">
                        {token.logoURI ? (
                          <img
                            src={token.logoURI}
                            alt={token.symbol}
                            className="w-5 h-5 rounded-full"
                          />
                        ) : null}
                        <span>{token.symbol}</span>
                      </div>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>

            {/* Swap Icon Button */}
            <div className="flex justify-center mb-4">
              <button
                onClick={swapSelectedTokens}
                className="bg-gradient-to-r from-blue-900 to-gray-700 hover:from-gray-700 hover:to-blue-900 p-3 rounded-full shadow-lg transform transition-transform duration-300 hover:rotate-180"
                title="Swap Tokens"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.1-.22 2.13-.6 3.06l1.46 1.46C19.61 15.01 20 13.56 20 12c0-4.42-3.58-8-8-8zm-6.06.94L4.48 6.4C3.39 7.99 3 9.44 3 11c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-1.1.22-2.13.6-3.06z" />
                </svg>
              </button>
            </div>

            {/* To Token */}
            <label className="text-sm mb-1 text-gray-300">To Token</label>
            <Listbox value={toToken} onChange={setToToken}>
              <div className="relative mb-4">
                <Listbox.Button className="w-full p-3 border rounded-xl bg-gray-700 text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getTokenDetails(toToken)?.logoURI ? (
                      <img
                        src={getTokenDetails(toToken)?.logoURI}
                        alt=""
                        className="w-5 h-5 rounded-full"
                      />
                    ) : null}
                    {getTokenDetails(toToken)?.symbol}
                  </span>
                  <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-gray-700 py-1 text-base text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {tokens.map((token) => (
                    <Listbox.Option
                      key={token.address}
                      value={token.address}
                      disabled={token.address === fromToken}
                      className={({ active, disabled }) =>
                        `cursor-pointer select-none relative py-2 px-4 ${
                          active ? "bg-gray-600" : ""
                        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
                      }
                    >
                      <div className="flex items-center gap-2">
                        {token.logoURI ? (
                          <img
                            src={token.logoURI}
                            alt={token.symbol}
                            className="w-5 h-5 rounded-full"
                          />
                        ) : null}
                        <span>{token.symbol}</span>
                      </div>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>

            <label className="text-sm mb-1 text-gray-300">Amount</label>
            <input
              value={amount}
              onChange={handleAmountChange}
              placeholder="Amount"
              type="text"
              inputMode="decimal"
              className="w-full mb-4 p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400"
            />

            <label className="text-sm mb-1 text-gray-300">Slippage</label>
            <select
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="w-full mb-4 p-3 rounded-xl bg-gray-700 text-white"
            >
              <option value="0.01">0.01%</option>
              <option value="0.05">0.05%</option>
              <option value="0.1">0.1%</option>
              <option value="1">1%</option>
            </select>
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

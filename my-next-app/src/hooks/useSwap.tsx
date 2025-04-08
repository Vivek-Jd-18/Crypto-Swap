"use client";

import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import erc20Abi from "../constants/abis/erc20.json";
import { kyberApiBase } from "@/constants/constant";

type Token = {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
};

export const useSwap = () => {
  const [swapResult, setSwapResult] = useState("");
  const [rawSwapData, setRawSwapData] = useState({});
  const [swapError, setSwapError] = useState("");
  const [ethereumTokens, setEthereumTokens] = useState<Token[]>([]);
  const [bnbTokens, setBnbTokens] = useState<Token[]>([]);

  const getQuote = async ({
    network,
    tokenIn,
    tokenOut,
    amount,
  }: {
    network: string;
    tokenIn: string;
    tokenOut: string;
    amount: string;
  }) => {
    try {
      const apiUrl = `${kyberApiBase}/${network}/api/v1/routes`;

      const response = await axios.get(apiUrl, {
        params: {
          tokenIn,
          tokenOut,
          amountIn: ethers.parseUnits(amount, 6).toString(),
        },
      });

      const { amountOut } = response.data.data.routeSummary;
      const formattedOut = ethers.formatEther(amountOut).toString();
      setSwapResult(formattedOut);
    } catch (err) {
      console.error("Quote error:", err);
      setSwapError("Failed to fetch quote.");
    }
  };

  const executeSwap = async ({
    network,
    tokenIn,
    tokenOut,
    amount,
    provider,
  }: {
    network: string;
    tokenIn: string;
    tokenOut: string;
    amount: string;
    provider: ethers.BrowserProvider;
  }) => {
    try {
      const signerInstance = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        tokenIn,
        erc20Abi,
        signerInstance,
      );
      const walletAddress = await signerInstance.getAddress();

      const quoteDetails: any = await axios.get(
        `${kyberApiBase}/${network}/api/v1/routes`,
        {
          params: {
            tokenIn,
            tokenOut,
            amountIn: ethers.parseUnits(amount, 6).toString(),
          },
        },
      );

      const { routeSummary, routerAddress } = quoteDetails.data.data;

      const formattedOut = ethers
        .formatEther(routeSummary.amountOut)
        .toString();
      setSwapResult(formattedOut);

      const buildPayload = {
        routeSummary,
        sender: walletAddress,
        recipient: walletAddress,
        slippageTolerance: 10,
      };

      const builtTx = await axios.post(
        `${kyberApiBase}/${network}/api/v1/route/build`,
        buildPayload,
      );

      const swapTxData = builtTx.data.data;
      setRawSwapData(swapTxData);

      const decimals = await tokenContract.decimals();
      const adjustedAmount = ethers.parseUnits(amount, decimals).toString();

      const approval = await tokenContract.approve(
        routerAddress,
        adjustedAmount,
      );
      await approval.wait();

      const finalSwapTx = await signerInstance.sendTransaction({
        data: swapTxData,
        to: routerAddress,
        from: walletAddress,
        maxFeePerGas: 1000000000000,
        maxPriorityFeePerGas: 1000000000000,
      });

      const txReceipt = await finalSwapTx.wait();
      if (!txReceipt) throw new Error("Transaction failed");
      console.log("Transaction complete:", txReceipt.hash);
    } catch (execErr: any) {
      console.error("Swap failed:", execErr);
      setSwapError(execErr.message);
    }
  };

  const fetchTokenList = async () => {
    try {
      const fetchTokens = async (chainId: number) => {
        const url = `https://ks-setting.kyberswap.com/api/v1/tokens?page=1&pageSize=100&isWhitelisted=true&chainIds=${chainId}`;
        const res = await axios.get(url, {
          headers: { accept: "application/json" },
        });
        return res.data.data.tokens;
      };

      const [ethTokens, bscTokens] = await Promise.all([
        fetchTokens(1), // Ethereum
        fetchTokens(56), // BNB
      ]);

      setEthereumTokens(ethTokens);
      setBnbTokens(bscTokens);
    } catch (error) {
      console.error("Error fetching token lists:", error);
      setSwapError("Unable to fetch token lists.");
    }
  };

  return {
    amountOut: swapResult,
    error: swapError,
    setError: setSwapError,
    handleSwap: executeSwap,
    fetchQuote: getQuote,
    fetchTokenList,
    ethereumTokens,
    bnbTokens,
  };
};

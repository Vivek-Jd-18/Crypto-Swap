import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import erc20Abi from "../constants/abis/erc20.json";
import { tokens, kyberApiBase } from "../constants/constant";

export default function Home() {
  const [account, setAccount] = useState<string>("");
  const [amount, setAmount] = useState<string>("1");
  const [amountOut, setAmountOut] = useState<string>("");
  const [encodedSwapData, setEncodedSwapData] = useState<any>(null);

  const tokenIn = tokens.USDC.address;
  const tokenOut = tokens.KNC.address;

  const connectWallet = async () => {
    if (!(window as any).ethereum) return alert("Please install MetaMask");
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };

  const fetchQuote = async () => {
    const url = `${kyberApiBase}/ethereum/api/v1/routes`;
    const amountIn = ethers.parseUnits(amount, tokens.USDC.decimals).toString();

    const params = {
      tokenIn,
      tokenOut,
      amountIn,
      gasInclude: true,
    };

    const { data } = await axios.get(url, { params });
    return data.data;
  };

  const handleSwap = async () => {
    if (!(window as any).ethereum) throw new Error("MetaMask not found");

    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const tokenContract = new ethers.Contract(tokenIn, erc20Abi, signer);

    const quote = await fetchQuote();
    const { routeSummary, routerAddress } = quote;
    const sender = await signer.getAddress();

    setAmountOut(
      ethers.formatUnits(routeSummary.amountOut, tokens.KNC.decimals),
    );

    const buildRouteUrl = `${kyberApiBase}/ethereum/api/v1/route/build`;
    const requestBody = {
      routeSummary,
      sender,
      recipient: sender,
      slippageTolerance: 10,
    };

    const { data } = await axios.post(buildRouteUrl, requestBody);
    const { data: txData, amountIn } = data.data;
    setEncodedSwapData(txData);

    const approveTx = await tokenContract.approve(routerAddress, amountIn);
    await approveTx.wait();

    const tx = await signer.sendTransaction({
      to: routerAddress,
      data: txData,
      maxFeePerGas: 1000000000000,
      maxPriorityFeePerGas: 1000000000000,
    });

    const receipt = await tx.wait();
    console.log("Swap Success, txHash:", receipt?.hash);
  };

  useEffect(() => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) =>
        setAccount(accounts[0]),
      );
    }
  }, []);

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">KyberSwap UI</h1>

      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <button
          className="p-2 bg-blue-500 text-white rounded"
          onClick={connectWallet}
        >
          Connect MetaMask
        </button>
      )}

      <div className="flex flex-col space-y-3">
        <input
          className="p-2 border"
          type="number"
          placeholder="Amount in USDC"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="p-2 bg-green-600 text-white rounded"
          onClick={handleSwap}
        >
          Swap
        </button>
        {amountOut && (
          <div>
            <p>Estimated Out: {amountOut} KNC</p>
          </div>
        )}
      </div>
    </div>
  );
}

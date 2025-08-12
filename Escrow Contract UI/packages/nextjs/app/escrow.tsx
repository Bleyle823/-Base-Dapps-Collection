"

import { useAccount, useConnect, useDisconnect, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import deployedContracts from "../contracts/deployedContracts";
import { useState } from "react";

const CHAIN_ID = 8453; // Base Mainnet
const ESCROW = deployedContracts[CHAIN_ID]?.SimpleEscrow;

export default function Escrow() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [depositAmount, setDepositAmount] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);

  // Example: get contract details
  const { data: contractDetails } = useContractRead({
    address: ESCROW.address as `0x${string}`,
    abi: ESCROW.abi,
    functionName: "getContractDetails",
    chainId: CHAIN_ID,
    watch: true,
  });

  // Example: deposit function
  const { write: deposit, data: depositData, isLoading: isDepositing } = useContractWrite({
    address: ESCROW.address as `0x${string}`,
    abi: ESCROW.abi,
    functionName: "deposit",
    chainId: CHAIN_ID,
    value: depositAmount ? BigInt(depositAmount) : undefined,
    onSuccess: (data) => setTxHash(data.hash),
  });

  // Wait for deposit tx
  useWaitForTransaction({
    hash: depositData?.hash,
    onSuccess: () => setDepositAmount("")
  });

  // Example: approve function
  const { write: approve, isLoading: isApproving } = useContractWrite({
    address: ESCROW.address as `0x${string}`,
    abi: ESCROW.abi,
    functionName: "approve",
    chainId: CHAIN_ID,
    onSuccess: (data) => setTxHash(data.hash),
  });

  return (
    <div className="max-w-xl mx-auto p-8 bg-base-200 rounded-xl mt-10 shadow">
      <h2 className="text-2xl font-bold mb-4">Escrow Contract Interaction</h2>
      {!isConnected ? (
        <button
          className="btn btn-primary"
          onClick={() => connect({ connector: connectors[0] })}
        >
          Connect Wallet
        </button>
      ) : (
        <div className="mb-4">
          <div className="mb-2">Connected as: <span className="font-mono text-sm">{address}</span></div>
          <button className="btn btn-outline btn-sm" onClick={() => disconnect()}>Disconnect</button>
        </div>
      )}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Contract Details</h3>
        <pre className="bg-base-100 p-2 rounded text-xs overflow-x-auto">
          {contractDetails ? JSON.stringify(contractDetails, null, 2) : "Loading..."}
        </pre>
      </div>
      {isConnected && (
        <>
          <div className="mb-4">
            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="Deposit Amount (wei)"
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)}
              min="0"
            />
            <button
              className="btn btn-success mt-2 w-full"
              onClick={() => deposit?.()}
              disabled={isDepositing || !depositAmount}
            >
              {isDepositing ? "Depositing..." : "Deposit"}
            </button>
          </div>
          <div className="mb-4">
            <button
              className="btn btn-info w-full"
              onClick={() => approve?.()}
              disabled={isApproving}
            >
              {isApproving ? "Approving..." : "Approve"}
            </button>
          </div>
        </>
      )}
      {txHash && (
        <div className="alert alert-info mt-4">
          <span>Transaction submitted: <a className="link" href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a></span>
        </div>
      )}
    </div>
  );
}

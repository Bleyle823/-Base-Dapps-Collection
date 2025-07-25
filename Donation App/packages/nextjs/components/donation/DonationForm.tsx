import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export function DonationForm({ campaignId, onSuccess }: { campaignId: string, onSuccess?: () => void }) {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: "DonationApp" });

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await writeContractAsync({
        functionName: "donate",
        args: [Number(campaignId), message],
        value: amount,
      });
      setAmount("");
      setMessage("");
      onSuccess?.();
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDonate} className="bg-base-100 p-6 rounded-xl shadow-lg flex flex-col gap-4">
      <input
        type="number"
        min="0"
        step="any"
        className="input input-bordered"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        className="input input-bordered"
        placeholder="Message (optional)"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button className="btn btn-primary" type="submit" disabled={loading || isMining}>
        {loading || isMining ? "Donating..." : "Donate"}
      </button>
    </form>
  );
}

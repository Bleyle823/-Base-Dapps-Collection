"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const GovernancePage = () => {
  const { address: connectedAddress } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");

  // Read contract data
  const { data: admin } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "admin",
  });

  const { data: balance } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "getBalance",
  });

  const { data: memberCount } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "memberCount",
  });

  const { data: quorum } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "quorum",
  });

  const { data: nextProposalId } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "nextProposalId",
  });

  const { data: votingPeriod } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "VOTING_PERIOD",
  });

  const { data: minVotingPower } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "MIN_VOTING_POWER",
  });

  const { data: currentUserMember } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "members",
    args: [connectedAddress],
  });

  // Write contract functions
  const { writeContractAsync: emergencyWithdraw } = useScaffoldWriteContract("SimpleDAO");

  const isAdmin = admin === connectedAddress;
  const isMember = currentUserMember?.[0] || false;

  const handleDepositToDAO = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      notification.error("Please enter a valid deposit amount");
      return;
    }

    try {
      // Send ETH directly to the DAO contract
      const tx = await window.ethereum?.request({
        method: 'eth_sendTransaction',
        params: [{
          from: connectedAddress,
          to: admin, // This should be the DAO contract address
          value: `0x${parseEther(depositAmount).toString(16)}`,
        }],
      });

      notification.success("Deposit sent to DAO treasury!");
      setDepositAmount("");
    } catch (error) {
      console.error("Error depositing to DAO:", error);
      notification.error("Failed to deposit to DAO");
    }
  };

  const handleEmergencyWithdraw = async () => {
    try {
      await emergencyWithdraw({
        functionName: "emergencyWithdraw",
      });

      notification.success("Emergency withdrawal completed!");
    } catch (error) {
      console.error("Error with emergency withdrawal:", error);
      notification.error("Failed to perform emergency withdrawal");
    }
  };

  const formatVotingPeriod = (period: bigint) => {
    const days = Number(period) / (24 * 60 * 60);
    return `${days} days`;
  };

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 w-full max-w-6xl">
        <h1 className="text-center text-4xl font-bold mb-8">DAO Governance</h1>

        {/* DAO Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-base-100 rounded-3xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Treasury Balance</h3>
            <p className="text-3xl font-bold text-primary">
              {balance ? formatEther(balance) : "0"} ETH
            </p>
          </div>
          <div className="bg-base-100 rounded-3xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Total Members</h3>
            <p className="text-3xl font-bold text-secondary">
              {memberCount?.toString() || "0"}
            </p>
          </div>
          <div className="bg-base-100 rounded-3xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Total Proposals</h3>
            <p className="text-3xl font-bold text-accent">
              {nextProposalId ? (Number(nextProposalId) - 1).toString() : "0"}
            </p>
          </div>
          <div className="bg-base-100 rounded-3xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Quorum Required</h3>
            <p className="text-3xl font-bold text-info">
              {quorum?.toString() || "0"}%
            </p>
          </div>
        </div>

        {/* DAO Settings */}
        <div className="bg-base-100 rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">DAO Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Voting Period</h3>
              <p className="text-xl">
                {votingPeriod ? formatVotingPeriod(votingPeriod) : "Loading..."}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Minimum Voting Power</h3>
              <p className="text-xl">
                {minVotingPower?.toString() || "0"} votes
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">DAO Admin</h3>
              <Address address={admin} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Status</h3>
              <div className="flex gap-2">
                <div className={`badge ${isMember ? 'badge-success' : 'badge-error'}`}>
                  {isMember ? 'Member' : 'Not Member'}
                </div>
                {isAdmin && <div className="badge badge-warning">Admin</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Treasury Management */}
        <div className="bg-base-100 rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Treasury Management</h2>
          
          {/* Deposit to DAO */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Contribute to DAO Treasury</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Amount (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered w-full"
                  placeholder="0.0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={handleDepositToDAO}
              >
                Deposit to DAO
              </button>
            </div>
            <p className="text-sm opacity-70 mt-2">
              Contribute ETH to the DAO treasury. These funds can be used for proposals approved by the community.
            </p>
          </div>

          {/* Emergency Withdrawal (Admin Only) */}
          {isAdmin && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-warning">Emergency Functions</h3>
              <div className="bg-warning bg-opacity-10 p-4 rounded-lg">
                <p className="text-sm mb-4">
                  <strong>Warning:</strong> Emergency withdrawal will transfer all DAO funds to the admin address. 
                  This should only be used during the initial setup phase or in extreme circumstances.
                </p>
                <button
                  className="btn btn-warning"
                  onClick={handleEmergencyWithdraw}
                >
                  Emergency Withdraw All Funds
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Your Participation */}
        {isMember && currentUserMember && (
          <div className="bg-base-100 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Your Participation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Voting Power</h3>
                <p className="text-2xl font-bold text-primary">
                  {currentUserMember[2]?.toString() || "0"} votes
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Member Since</h3>
                <p className="text-lg">
                  {currentUserMember[1] 
                    ? new Date(Number(currentUserMember[1]) * 1000).toLocaleDateString()
                    : "Unknown"
                  }
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Participation</h3>
                <div className="flex flex-col gap-1">
                  <div className="badge badge-outline">Active Member</div>
                  {isAdmin && <div className="badge badge-warning">Administrator</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-base-100 rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6">How DAO Governance Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">1. Proposal Creation</h3>
              <p className="text-sm opacity-70">
                DAO members can create proposals for community decisions, including fund transfers and governance changes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">2. Voting Period</h3>
              <p className="text-sm opacity-70">
                Each proposal has a {votingPeriod ? formatVotingPeriod(votingPeriod) : "7 day"} voting period where members can vote for or against.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">3. Quorum Requirement</h3>
              <p className="text-sm opacity-70">
                At least {quorum?.toString() || "51"}% of total voting power must participate for a proposal to be valid.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">4. Execution</h3>
              <p className="text-sm opacity-70">
                Approved proposals can be executed by any member after the voting period ends.
              </p>
            </div>
          </div>
        </div>

        {/* Non-Member Information */}
        {!isMember && (
          <div className="text-center mt-8 p-6 bg-base-200 rounded-3xl">
            <h3 className="text-xl font-bold mb-2">Join the DAO</h3>
            <p className="text-lg">Become a member to participate in governance and proposal voting.</p>
            <p className="text-sm opacity-70 mt-2">
              Contact the admin to request membership: <Address address={admin} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernancePage;

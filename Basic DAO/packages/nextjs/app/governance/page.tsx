"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { 
  CogIcon, 
  BanknotesIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ShieldCheckIcon,
  StarIcon
} from "@heroicons/react/24/outline";

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

  const stats = [
    {
      icon: BanknotesIcon,
      title: "Treasury Balance",
      value: balance ? `${Number(balance) / 1e18} ETH` : "0 ETH",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: UserGroupIcon,
      title: "Total Members",
      value: memberCount?.toString() || "0",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: DocumentTextIcon,
      title: "Total Proposals",
      value: nextProposalId ? (Number(nextProposalId) - 1).toString() : "0",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: ChartBarIcon,
      title: "Quorum Required",
      value: `${quorum?.toString() || "0"}%`,
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-8">DAO Governance</h1>

        {/* DAO Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div key={index} className="bg-base-100 rounded-3xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className={`flex items-center justify-center mb-3 w-16 h-16 rounded-2xl ${stat.bgColor} mx-auto`}>
                  <StatIcon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* DAO Configuration */}
        <div className="bg-base-100 rounded-3xl p-8 mb-8 shadow-lg border border-base-300">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CogIcon className="h-6 w-6" />
            DAO Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-base-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 text-primary" />
                  <span className="font-medium">Voting Period</span>
                </div>
                <span className="text-lg font-semibold">
                  {votingPeriod ? formatVotingPeriod(votingPeriod) : "Loading..."}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-base-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-5 w-5 text-secondary" />
                  <span className="font-medium">Minimum Voting Power</span>
                </div>
                <span className="text-lg font-semibold">
                  {minVotingPower?.toString() || "0"} votes
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-base-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <StarIcon className="h-5 w-5 text-warning" />
                  <span className="font-medium">DAO Admin</span>
                </div>
                <Address address={admin} />
              </div>
              <div className="flex items-center justify-between p-4 bg-base-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <UserGroupIcon className="h-5 w-5 text-accent" />
                  <span className="font-medium">Your Status</span>
                </div>
                <div className="flex gap-2">
                  <div className={`badge ${isMember ? 'badge-success' : 'badge-error'}`}>
                    {isMember ? 'Member' : 'Not Member'}
                  </div>
                  {isAdmin && <div className="badge badge-warning">Admin</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Treasury Management */}
        <div className="bg-base-100 rounded-3xl p-8 mb-8 shadow-lg border border-base-300">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BanknotesIcon className="h-6 w-6" />
            Treasury Management
          </h2>
          
          {/* Deposit to DAO */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Contribute to DAO Treasury</h3>
            <div className="bg-base-200 rounded-2xl p-6">
              <div className="flex gap-4 items-end mb-4">
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
                  className="btn btn-primary gap-2"
                  onClick={handleDepositToDAO}
                >
                  <ArrowUpIcon className="h-4 w-4" />
                  Deposit to DAO
                </button>
              </div>
              <p className="text-sm opacity-70">
                Contribute ETH to the DAO treasury. These funds can be used for proposals approved by the community.
              </p>
            </div>
          </div>

          {/* Emergency Withdrawal (Admin Only) */}
          {isAdmin && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-warning flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                Emergency Functions
              </h3>
              <div className="bg-warning bg-opacity-10 p-6 rounded-2xl border border-warning/20">
                <p className="text-sm mb-4">
                  <strong>Warning:</strong> Emergency withdrawal will transfer all DAO funds to the admin address. 
                  This should only be used during the initial setup phase or in extreme circumstances.
                </p>
                <button
                  className="btn btn-warning gap-2"
                  onClick={handleEmergencyWithdraw}
                >
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  Emergency Withdraw All Funds
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Your Participation */}
        {isMember && currentUserMember && (
          <div className="bg-base-100 rounded-3xl p-8 mb-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <UserGroupIcon className="h-6 w-6" />
              Your Participation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-base-200 rounded-2xl">
                <h3 className="text-lg font-semibold mb-2">Your Voting Power</h3>
                <p className="text-2xl font-bold text-primary">
                  {currentUserMember[2]?.toString() || "0"} votes
                </p>
              </div>
              <div className="text-center p-4 bg-base-200 rounded-2xl">
                <h3 className="text-lg font-semibold mb-2">Member Since</h3>
                <div className="flex items-center justify-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  <p className="text-lg">
                    {currentUserMember[1] 
                      ? new Date(Number(currentUserMember[1]) * 1000).toLocaleDateString()
                      : "Unknown"
                    }
                  </p>
                </div>
              </div>
              <div className="text-center p-4 bg-base-200 rounded-2xl">
                <h3 className="text-lg font-semibold mb-2">Participation</h3>
                <div className="flex flex-col gap-1 items-center">
                  <div className="badge badge-outline">Active Member</div>
                  {isAdmin && <div className="badge badge-warning gap-1">
                    <StarIcon className="h-3 w-3" />
                    Administrator
                  </div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-base-100 rounded-3xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">How DAO Governance Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-base-200 rounded-2xl">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-primary" />
                1. Proposal Creation
              </h3>
              <p className="text-sm opacity-70">
                DAO members can create proposals for community decisions, including fund transfers and governance changes.
              </p>
            </div>
            <div className="p-4 bg-base-200 rounded-2xl">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-secondary" />
                2. Voting Period
              </h3>
              <p className="text-sm opacity-70">
                Each proposal has a {votingPeriod ? formatVotingPeriod(votingPeriod) : "7 day"} voting period where members can vote for or against.
              </p>
            </div>
            <div className="p-4 bg-base-200 rounded-2xl">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-accent" />
                3. Quorum Requirement
              </h3>
              <p className="text-sm opacity-70">
                At least {quorum?.toString() || "51"}% of total voting power must participate for a proposal to be valid.
              </p>
            </div>
            <div className="p-4 bg-base-200 rounded-2xl">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <CogIcon className="h-5 w-5 text-info" />
                4. Execution
              </h3>
              <p className="text-sm opacity-70">
                Approved proposals can be executed by any member after the voting period ends.
              </p>
            </div>
          </div>
        </div>

        {/* Non-Member Information */}
        {!isMember && (
          <div className="text-center p-8 bg-base-200 rounded-3xl">
            <UserGroupIcon className="h-12 w-12 text-base-content/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Join the DAO</h3>
            <p className="text-lg mb-4">Become a member to participate in governance and proposal voting.</p>
            <p className="text-sm opacity-70">
              Contact the admin to request membership: <Address address={admin} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernancePage;

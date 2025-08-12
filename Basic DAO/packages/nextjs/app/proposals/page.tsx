"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { 
  DocumentTextIcon, 
  UserIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  PlayIcon,
  PlusIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

interface Proposal {
  id: number;
  proposer: string;
  description: string;
  amount: bigint;
  recipient: string;
  votesFor: bigint;
  votesAgainst: bigint;
  startTime: bigint;
  endTime: bigint;
  executed: boolean;
  isActive: boolean;
}

const ProposalsPage = () => {
  const { address: connectedAddress } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [newProposal, setNewProposal] = useState({
    description: "",
    amount: "",
    recipient: "",
  });
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Read contract data
  const { data: nextProposalId } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "nextProposalId",
  });

  const { data: isMember } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "members",
    args: [connectedAddress],
  });

  // Write contract functions
  const { writeContractAsync: createProposal } = useScaffoldWriteContract("SimpleDAO");
  const { writeContractAsync: vote } = useScaffoldWriteContract("SimpleDAO");
  const { writeContractAsync: executeProposal } = useScaffoldWriteContract("SimpleDAO");

  // Load proposals
  useEffect(() => {
    const loadProposals = async () => {
      if (!nextProposalId) return;
      
      setLoading(true);
      const proposalPromises = [];
      for (let i = 1; i < Number(nextProposalId); i++) {
        proposalPromises.push(
          fetch(`/api/proposal/${i}`)
            .then(res => res.json())
            .catch(() => null)
        );
      }
      
      const proposalResults = await Promise.all(proposalPromises);
      setProposals(proposalResults.filter(Boolean));
      setLoading(false);
    };

    loadProposals();
  }, [nextProposalId]);

  const handleCreateProposal = async () => {
    if (!newProposal.description.trim()) {
      notification.error("Please enter a proposal description");
      return;
    }

    try {
      const amount = newProposal.amount ? parseEther(newProposal.amount) : 0n;
      const recipient = newProposal.recipient || "0x0000000000000000000000000000000000000000";

      await createProposal({
        functionName: "createProposal",
        args: [newProposal.description, amount, recipient],
      });

      notification.success("Proposal created successfully!");
      setNewProposal({ description: "", amount: "", recipient: "" });
      setShowCreateForm(false);
      
      // Reload proposals
      window.location.reload();
    } catch (error) {
      console.error("Error creating proposal:", error);
      notification.error("Failed to create proposal");
    }
  };

  const handleVote = async (proposalId: number, support: boolean) => {
    try {
      await vote({
        functionName: "vote",
        args: [BigInt(proposalId), support],
      });

      notification.success(`Vote cast ${support ? "in favor" : "against"}!`);
      
      // Reload proposals
      window.location.reload();
    } catch (error) {
      console.error("Error voting:", error);
      notification.error("Failed to cast vote");
    }
  };

  const handleExecute = async (proposalId: number) => {
    try {
      await executeProposal({
        functionName: "executeProposal",
        args: [BigInt(proposalId)],
      });

      notification.success("Proposal executed successfully!");
      
      // Reload proposals
      window.location.reload();
    } catch (error) {
      console.error("Error executing proposal:", error);
      notification.error("Failed to execute proposal");
    }
  };

  const formatTimeRemaining = (endTime: bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = Number(endTime) - now;
    
    if (remaining <= 0) return "Voting ended";
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const getProposalStatus = (proposal: Proposal) => {
    if (proposal.executed) return { status: "Executed", color: "success", icon: CheckCircleIcon };
    if (!proposal.isActive) {
      if (proposal.votesFor > proposal.votesAgainst) {
        return { status: "Approved", color: "success", icon: CheckCircleIcon };
      } else {
        return { status: "Rejected", color: "error", icon: XCircleIcon };
      }
    }
    return { status: "Active", color: "info", icon: ClockIcon };
  };

  const getVotePercentage = (votesFor: bigint, votesAgainst: bigint) => {
    const total = Number(votesFor) + Number(votesAgainst);
    if (total === 0) return { for: 0, against: 0 };
    return {
      for: Math.round((Number(votesFor) / total) * 100),
      against: Math.round((Number(votesAgainst) / total) * 100)
    };
  };

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">DAO Proposals</h1>
          {isMember?.[0] && (
            <button
              className="btn btn-primary gap-2"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <PlusIcon className="h-5 w-5" />
              Create Proposal
            </button>
          )}
        </div>
        
        {/* Create Proposal Section */}
        {showCreateForm && isMember?.[0] && (
          <div className="bg-base-100 rounded-3xl p-8 mb-8 shadow-lg border border-base-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <DocumentTextIcon className="h-6 w-6" />
              Create New Proposal
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  placeholder="Describe your proposal in detail..."
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (ETH) - Optional</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.0"
                    value={newProposal.amount}
                    onChange={(e) => setNewProposal({ ...newProposal, amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient Address - Optional</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="0x..."
                    value={newProposal.recipient}
                    onChange={(e) => setNewProposal({ ...newProposal, recipient: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className="btn btn-primary"
                  onClick={handleCreateProposal}
                >
                  Create Proposal
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Proposals List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="loading loading-spinner loading-lg"></div>
              <p className="mt-4 text-lg">Loading proposals...</p>
            </div>
          ) : proposals.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
              <p className="text-lg">No proposals yet. Be the first to create one!</p>
              {isMember?.[0] && (
                <button
                  className="btn btn-primary mt-4"
                  onClick={() => setShowCreateForm(true)}
                >
                  Create First Proposal
                </button>
              )}
            </div>
          ) : (
            proposals.map((proposal) => {
              const status = getProposalStatus(proposal);
              const votePercentages = getVotePercentage(proposal.votesFor, proposal.votesAgainst);
              const StatusIcon = status.icon;
              
              return (
                <div key={proposal.id} className="bg-base-100 rounded-3xl p-6 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">Proposal #{proposal.id}</h3>
                        <div className={`badge badge-${status.color} gap-1`}>
                          <StatusIcon className="h-4 w-4" />
                          {status.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <UserIcon className="h-4 w-4" />
                        <span>Proposed by:</span>
                        <Address address={proposal.proposer} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <ClockIcon className="h-4 w-4" />
                        <span>{formatTimeRemaining(proposal.endTime)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-base leading-relaxed">{proposal.description}</p>
                  </div>

                  {proposal.amount > 0n && (
                    <div className="mb-6 p-4 bg-base-200 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2">
                        <ChartBarIcon className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Fund Transfer</span>
                      </div>
                      <p className="text-sm">
                        <strong>{formatEther(proposal.amount)} ETH</strong> to{" "}
                        <Address address={proposal.recipient} />
                      </p>
                    </div>
                  )}

                  {/* Voting Results */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Voting Results</h4>
                      <span className="text-sm text-base-content/70">
                        {proposal.votesFor.toString()} For • {proposal.votesAgainst.toString()} Against
                      </span>
                    </div>
                    <div className="w-full bg-base-300 rounded-full h-3 mb-2">
                      <div 
                        className="bg-success h-3 rounded-full transition-all duration-500"
                        style={{ width: `${votePercentages.for}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-success font-medium">{votePercentages.for}% For</span>
                      <span className="text-error font-medium">{votePercentages.against}% Against</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-center">
                    {isMember?.[0] && proposal.isActive && (
                      <>
                        <button
                          className="btn btn-success gap-2"
                          onClick={() => handleVote(proposal.id, true)}
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          Vote For
                        </button>
                        <button
                          className="btn btn-error gap-2"
                          onClick={() => handleVote(proposal.id, false)}
                        >
                          <XCircleIcon className="h-4 w-4" />
                          Vote Against
                        </button>
                      </>
                    )}

                    {!proposal.isActive && !proposal.executed && proposal.votesFor > proposal.votesAgainst && (
                      <button
                        className="btn btn-primary gap-2"
                        onClick={() => handleExecute(proposal.id)}
                      >
                        <PlayIcon className="h-4 w-4" />
                        Execute Proposal
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!isMember?.[0] && (
          <div className="text-center mt-8 p-8 bg-base-200 rounded-3xl">
            <UserIcon className="h-12 w-12 text-base-content/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Members Only</h3>
            <p className="text-lg mb-4">You must be a DAO member to create proposals and vote.</p>
            <p className="text-sm opacity-70">Contact the DAO admin to become a member.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalsPage;

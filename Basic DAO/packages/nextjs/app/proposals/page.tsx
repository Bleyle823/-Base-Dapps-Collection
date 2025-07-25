"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

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

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 w-full max-w-6xl">
        <h1 className="text-center text-4xl font-bold mb-8">DAO Proposals</h1>
        
        {/* Create Proposal Section */}
        {isMember?.[0] && (
          <div className="bg-base-100 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Proposal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={4}
                  placeholder="Describe your proposal..."
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
              <button
                className="btn btn-primary"
                onClick={handleCreateProposal}
              >
                Create Proposal
              </button>
            </div>
          </div>
        )}

        {/* Proposals List */}
        <div className="space-y-6">
          {proposals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg">No proposals yet. Be the first to create one!</p>
            </div>
          ) : (
            proposals.map((proposal) => (
              <div key={proposal.id} className="bg-base-100 rounded-3xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Proposal #{proposal.id}</h3>
                    <p className="text-sm opacity-70">
                      Proposed by: <Address address={proposal.proposer} />
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`badge ${proposal.isActive ? 'badge-success' : proposal.executed ? 'badge-info' : 'badge-error'}`}>
                      {proposal.isActive ? 'Active' : proposal.executed ? 'Executed' : 'Failed/Expired'}
                    </div>
                    <p className="text-sm mt-1">{formatTimeRemaining(proposal.endTime)}</p>
                  </div>
                </div>

                <p className="mb-4">{proposal.description}</p>

                {proposal.amount > 0n && (
                  <div className="mb-4 p-3 bg-base-200 rounded-lg">
                    <p className="text-sm">
                      <strong>Transfer:</strong> {formatEther(proposal.amount)} ETH to{" "}
                      <Address address={proposal.recipient} />
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm opacity-70">Votes For</p>
                    <p className="text-2xl font-bold text-success">{proposal.votesFor.toString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm opacity-70">Votes Against</p>
                    <p className="text-2xl font-bold text-error">{proposal.votesAgainst.toString()}</p>
                  </div>
                </div>

                {/* Voting Buttons */}
                {isMember?.[0] && proposal.isActive && (
                  <div className="flex gap-2 justify-center">
                    <button
                      className="btn btn-success"
                      onClick={() => handleVote(proposal.id, true)}
                    >
                      Vote For
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleVote(proposal.id, false)}
                    >
                      Vote Against
                    </button>
                  </div>
                )}

                {/* Execute Button */}
                {!proposal.isActive && !proposal.executed && proposal.votesFor > proposal.votesAgainst && (
                  <div className="flex justify-center">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleExecute(proposal.id)}
                    >
                      Execute Proposal
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {!isMember?.[0] && (
          <div className="text-center mt-8 p-6 bg-base-200 rounded-3xl">
            <p className="text-lg">You must be a DAO member to create proposals and vote.</p>
            <p className="text-sm opacity-70 mt-2">Contact the DAO admin to become a member.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalsPage;

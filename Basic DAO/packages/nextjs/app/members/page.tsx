"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const MembersPage = () => {
  const { address: connectedAddress } = useAccount();
  const [newMemberAddress, setNewMemberAddress] = useState("");
  const [newMemberVotingPower, setNewMemberVotingPower] = useState("1");
  const [removeMemberAddress, setRemoveMemberAddress] = useState("");

  // Read contract data
  const { data: admin } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "admin",
  });

  const { data: memberCount } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "memberCount",
  });

  const { data: currentUserMember } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "members",
    args: [connectedAddress],
  });

  const { data: quorum } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "quorum",
  });

  // Write contract functions
  const { writeContractAsync: addMember } = useScaffoldWriteContract("SimpleDAO");
  const { writeContractAsync: removeMember } = useScaffoldWriteContract("SimpleDAO");
  const { writeContractAsync: setQuorum } = useScaffoldWriteContract("SimpleDAO");

  const isAdmin = admin === connectedAddress;
  const isMember = currentUserMember?.[0] || false;

  const handleAddMember = async () => {
    if (!isAddress(newMemberAddress)) {
      notification.error("Please enter a valid Ethereum address");
      return;
    }

    const votingPower = parseInt(newMemberVotingPower);
    if (isNaN(votingPower) || votingPower < 1) {
      notification.error("Voting power must be at least 1");
      return;
    }

    try {
      await addMember({
        functionName: "addMember",
        args: [newMemberAddress, BigInt(votingPower)],
      });

      notification.success("Member added successfully!");
      setNewMemberAddress("");
      setNewMemberVotingPower("1");
    } catch (error) {
      console.error("Error adding member:", error);
      notification.error("Failed to add member");
    }
  };

  const handleRemoveMember = async () => {
    if (!isAddress(removeMemberAddress)) {
      notification.error("Please enter a valid Ethereum address");
      return;
    }

    try {
      await removeMember({
        functionName: "removeMember",
        args: [removeMemberAddress],
      });

      notification.success("Member removed successfully!");
      setRemoveMemberAddress("");
    } catch (error) {
      console.error("Error removing member:", error);
      notification.error("Failed to remove member");
    }
  };

  const [newQuorum, setNewQuorum] = useState("");

  const handleSetQuorum = async () => {
    const quorumValue = parseInt(newQuorum);
    if (isNaN(quorumValue) || quorumValue < 1 || quorumValue > 100) {
      notification.error("Quorum must be between 1 and 100");
      return;
    }

    try {
      await setQuorum({
        functionName: "setQuorum",
        args: [BigInt(quorumValue)],
      });

      notification.success("Quorum updated successfully!");
      setNewQuorum("");
    } catch (error) {
      console.error("Error setting quorum:", error);
      notification.error("Failed to update quorum");
    }
  };

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 w-full max-w-4xl">
        <h1 className="text-center text-4xl font-bold mb-8">DAO Members</h1>

        {/* Member Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-base-100 rounded-3xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Total Members</h3>
            <p className="text-3xl font-bold text-primary">{memberCount?.toString() || "0"}</p>
          </div>
          <div className="bg-base-100 rounded-3xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Current Quorum</h3>
            <p className="text-3xl font-bold text-secondary">{quorum?.toString() || "0"}%</p>
          </div>
          <div className="bg-base-100 rounded-3xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Your Status</h3>
            <div className={`badge ${isMember ? 'badge-success' : 'badge-error'} text-lg p-3`}>
              {isMember ? 'Member' : 'Not Member'}
            </div>
          </div>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="space-y-8">
            {/* Add Member */}
            <div className="bg-base-100 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">Add New Member</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Member Address</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="0x..."
                    value={newMemberAddress}
                    onChange={(e) => setNewMemberAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Voting Power</label>
                  <input
                    type="number"
                    min="1"
                    className="input input-bordered w-full"
                    placeholder="1"
                    value={newMemberVotingPower}
                    onChange={(e) => setNewMemberVotingPower(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleAddMember}
                >
                  Add Member
                </button>
              </div>
            </div>

            {/* Remove Member */}
            <div className="bg-base-100 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">Remove Member</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Member Address</label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="0x..."
                    value={removeMemberAddress}
                    onChange={(e) => setRemoveMemberAddress(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-error"
                  onClick={handleRemoveMember}
                >
                  Remove Member
                </button>
              </div>
            </div>

            {/* Set Quorum */}
            <div className="bg-base-100 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">Update Quorum</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quorum Percentage (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="input input-bordered w-full"
                    placeholder="51"
                    value={newQuorum}
                    onChange={(e) => setNewQuorum(e.target.value)}
                  />
                  <p className="text-sm opacity-70 mt-1">
                    Current quorum: {quorum?.toString() || "0"}%
                  </p>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={handleSetQuorum}
                >
                  Update Quorum
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Member Information */}
        <div className="bg-base-100 rounded-3xl p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Your Membership</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm opacity-70">Your Address</p>
              <Address address={connectedAddress} />
            </div>
            {isMember && currentUserMember && (
              <>
                <div>
                  <p className="text-sm opacity-70">Voting Power</p>
                  <p className="text-lg font-semibold">{currentUserMember[2]?.toString() || "0"}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Joined At</p>
                  <p className="text-lg">
                    {currentUserMember[1] 
                      ? new Date(Number(currentUserMember[1]) * 1000).toLocaleDateString()
                      : "Unknown"
                    }
                  </p>
                </div>
              </>
            )}
            {isAdmin && (
              <div className="mt-4">
                <div className="badge badge-warning">DAO Admin</div>
              </div>
            )}
          </div>
        </div>

        {/* Information for Non-Members */}
        {!isMember && !isAdmin && (
          <div className="text-center mt-8 p-6 bg-base-200 rounded-3xl">
            <h3 className="text-xl font-bold mb-2">Not a DAO Member</h3>
            <p className="text-lg">You need to be added as a member by the DAO admin to participate.</p>
            <p className="text-sm opacity-70 mt-2">
              Contact the admin at: <Address address={admin} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPage;

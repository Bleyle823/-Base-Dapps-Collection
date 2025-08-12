"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { 
  UserGroupIcon, 
  UserPlusIcon, 
  UserMinusIcon, 
  CogIcon, 
  ShieldCheckIcon,
  CalendarIcon,
  ChartBarIcon,
  StarIcon
} from "@heroicons/react/24/outline";

const MembersPage = () => {
  const { address: connectedAddress } = useAccount();
  const [newMemberAddress, setNewMemberAddress] = useState("");
  const [newMemberVotingPower, setNewMemberVotingPower] = useState("1");
  const [removeMemberAddress, setRemoveMemberAddress] = useState("");
  const [newQuorum, setNewQuorum] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

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

  const tabs = [
    { id: "overview", label: "Overview", icon: ChartBarIcon },
    { id: "admin", label: "Admin Panel", icon: CogIcon, adminOnly: true },
    { id: "profile", label: "My Profile", icon: UserGroupIcon },
  ];

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-8">DAO Members</h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="tabs tabs-boxed">
            {tabs.map((tab) => {
              if (tab.adminOnly && !isAdmin) return null;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`tab gap-2 ${activeTab === tab.id ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Member Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-base-100 rounded-3xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center mb-3">
                  <UserGroupIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Total Members</h3>
                <p className="text-3xl font-bold text-primary">{memberCount?.toString() || "0"}</p>
              </div>
              <div className="bg-base-100 rounded-3xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center mb-3">
                  <CogIcon className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Current Quorum</h3>
                <p className="text-3xl font-bold text-secondary">{quorum?.toString() || "0"}%</p>
              </div>
              <div className="bg-base-100 rounded-3xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center mb-3">
                  <ShieldCheckIcon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Your Status</h3>
                <div className={`badge ${isMember ? 'badge-success' : 'badge-error'} text-lg p-3`}>
                  {isMember ? 'Member' : 'Not Member'}
                </div>
              </div>
            </div>

            {/* DAO Information */}
            <div className="bg-base-100 rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <UserGroupIcon className="h-6 w-6" />
                DAO Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                                     <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                     <StarIcon className="h-5 w-5 text-warning" />
                     DAO Admin
                   </h3>
                  <Address address={admin} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Governance Settings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm opacity-70">Quorum Required:</span>
                      <span className="font-medium">{quorum?.toString() || "0"}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm opacity-70">Total Members:</span>
                      <span className="font-medium">{memberCount?.toString() || "0"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Panel Tab */}
        {activeTab === "admin" && isAdmin && (
          <div className="space-y-8">
            {/* Add Member */}
            <div className="bg-base-100 rounded-3xl p-8 shadow-lg border border-base-300">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <UserPlusIcon className="h-6 w-6" />
                Add New Member
              </h2>
              <div className="space-y-6">
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
                  className="btn btn-primary gap-2"
                  onClick={handleAddMember}
                >
                  <UserPlusIcon className="h-4 w-4" />
                  Add Member
                </button>
              </div>
            </div>

            {/* Remove Member */}
            <div className="bg-base-100 rounded-3xl p-8 shadow-lg border border-base-300">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <UserMinusIcon className="h-6 w-6" />
                Remove Member
              </h2>
              <div className="space-y-6">
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
                  className="btn btn-error gap-2"
                  onClick={handleRemoveMember}
                >
                  <UserMinusIcon className="h-4 w-4" />
                  Remove Member
                </button>
              </div>
            </div>

            {/* Set Quorum */}
            <div className="bg-base-100 rounded-3xl p-8 shadow-lg border border-base-300">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CogIcon className="h-6 w-6" />
                Update Quorum
              </h2>
              <div className="space-y-6">
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
                  <p className="text-sm opacity-70 mt-2">
                    Current quorum: {quorum?.toString() || "0"}%
                  </p>
                </div>
                <button
                  className="btn btn-secondary gap-2"
                  onClick={handleSetQuorum}
                >
                  <CogIcon className="h-4 w-4" />
                  Update Quorum
                </button>
              </div>
            </div>
          </div>
        )}

        {/* My Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            {/* Member Information */}
            <div className="bg-base-100 rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <UserGroupIcon className="h-6 w-6" />
                Your Membership
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Address</label>
                  <Address address={connectedAddress} />
                </div>
                {isMember && currentUserMember && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Voting Power</label>
                      <p className="text-lg font-semibold">{currentUserMember[2]?.toString() || "0"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Member Since</label>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <p className="text-lg">
                          {currentUserMember[1] 
                            ? new Date(Number(currentUserMember[1]) * 1000).toLocaleDateString()
                            : "Unknown"
                          }
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {isAdmin && (
                                     <div className="mt-6">
                     <div className="badge badge-warning gap-2">
                       <StarIcon className="h-4 w-4" />
                       DAO Admin
                     </div>
                   </div>
                )}
              </div>
            </div>

            {/* Membership Status */}
            {!isMember && !isAdmin && (
              <div className="text-center p-8 bg-base-200 rounded-3xl">
                <UserGroupIcon className="h-12 w-12 text-base-content/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Not a DAO Member</h3>
                <p className="text-lg mb-4">You need to be added as a member by the DAO admin to participate.</p>
                <p className="text-sm opacity-70">
                  Contact the admin at: <Address address={admin} />
                </p>
              </div>
            )}
          </div>
        )}

                 {/* Access Denied for Admin Panel */}
         {activeTab === "admin" && !isAdmin && (
           <div className="text-center p-8 bg-base-200 rounded-3xl">
             <StarIcon className="h-12 w-12 text-base-content/50 mx-auto mb-4" />
             <h3 className="text-xl font-bold mb-2">Admin Access Required</h3>
             <p className="text-lg">Only the DAO admin can access the admin panel.</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default MembersPage;

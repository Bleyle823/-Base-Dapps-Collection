"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  TrendingUpIcon,
  TrendingDownIcon
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

const DashboardPage = () => {
  const { address: connectedAddress } = useAccount();
  const [recentProposals, setRecentProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  // Read contract data
  const { data: balance } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "getBalance",
  });

  const { data: memberCount } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "memberCount",
  });

  const { data: nextProposalId } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "nextProposalId",
  });

  const { data: quorum } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "quorum",
  });

  const { data: currentUserMember } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "members",
    args: [connectedAddress],
  });

  // Load recent proposals
  useEffect(() => {
    const loadRecentProposals = async () => {
      if (!nextProposalId) return;
      
      setLoading(true);
      const proposalPromises = [];
      const startIndex = Math.max(1, Number(nextProposalId) - 5); // Get last 5 proposals
      
      for (let i = startIndex; i < Number(nextProposalId); i++) {
        proposalPromises.push(
          fetch(`/api/proposal/${i}`)
            .then(res => res.json())
            .catch(() => null)
        );
      }
      
      const proposalResults = await Promise.all(proposalPromises);
      setRecentProposals(proposalResults.filter(Boolean).reverse()); // Most recent first
      setLoading(false);
    };

    loadRecentProposals();
  }, [nextProposalId]);

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

  const formatTimeRemaining = (endTime: bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = Number(endTime) - now;
    
    if (remaining <= 0) return "Ended";
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const isMember = currentUserMember?.[0] || false;

  const metrics = [
    {
      icon: BanknotesIcon,
      title: "Treasury Balance",
      value: balance ? `${Number(balance) / 1e18} ETH` : "0 ETH",
      change: "+2.5%",
      changeType: "positive",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: UserGroupIcon,
      title: "Active Members",
      value: memberCount?.toString() || "0",
      change: "+1",
      changeType: "positive",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: DocumentTextIcon,
      title: "Total Proposals",
      value: nextProposalId ? (Number(nextProposalId) - 1).toString() : "0",
      change: "+3",
      changeType: "positive",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: ChartBarIcon,
      title: "Quorum Required",
      value: `${quorum?.toString() || "0"}%`,
      change: "No change",
      changeType: "neutral",
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 w-full max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">DAO Dashboard</h1>
          <p className="text-lg text-base-content/70">
            Welcome back! Here's an overview of your DAO's activity and governance.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const MetricIcon = metric.icon;
            return (
              <div key={index} className="bg-base-100 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${metric.bgColor}`}>
                    <MetricIcon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.changeType === 'positive' ? 'text-success' : 
                    metric.changeType === 'negative' ? 'text-error' : 'text-base-content/50'
                  }`}>
                    {metric.changeType === 'positive' && <TrendingUpIcon className="h-4 w-4" />}
                    {metric.changeType === 'negative' && <TrendingDownIcon className="h-4 w-4" />}
                    <span>{metric.change}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1">{metric.title}</h3>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Proposals */}
          <div className="lg:col-span-2">
            <div className="bg-base-100 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <DocumentTextIcon className="h-6 w-6" />
                  Recent Proposals
                </h2>
                <a href="/proposals" className="btn btn-primary btn-sm">
                  View All
                </a>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="loading loading-spinner loading-lg"></div>
                  <p className="mt-4">Loading proposals...</p>
                </div>
              ) : recentProposals.length === 0 ? (
                <div className="text-center py-8">
                  <DocumentTextIcon className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
                  <p className="text-lg">No proposals yet.</p>
                  {isMember && (
                    <a href="/proposals" className="btn btn-primary mt-4">
                      Create First Proposal
                    </a>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProposals.map((proposal) => {
                    const status = getProposalStatus(proposal);
                    const StatusIcon = status.icon;
                    
                    return (
                      <div key={proposal.id} className="p-4 bg-base-200 rounded-2xl hover:bg-base-300 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">Proposal #{proposal.id}</h3>
                            <div className={`badge badge-${status.color} gap-1`}>
                              <StatusIcon className="h-3 w-3" />
                              {status.status}
                            </div>
                          </div>
                          <span className="text-sm text-base-content/70">
                            {formatTimeRemaining(proposal.endTime)}
                          </span>
                        </div>
                        <p className="text-sm text-base-content/80 mb-2 line-clamp-2">
                          {proposal.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-base-content/60">
                          <span>By: <Address address={proposal.proposer} /></span>
                          <span>{proposal.votesFor.toString()} For • {proposal.votesAgainst.toString()} Against</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-base-100 rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {isMember ? (
                  <>
                    <a href="/proposals" className="btn btn-primary w-full gap-2">
                      <DocumentTextIcon className="h-4 w-4" />
                      Create Proposal
                    </a>
                    <a href="/governance" className="btn btn-secondary w-full gap-2">
                      <BanknotesIcon className="h-4 w-4" />
                      Manage Treasury
                    </a>
                    <a href="/members" className="btn btn-accent w-full gap-2">
                      <UserGroupIcon className="h-4 w-4" />
                      View Members
                    </a>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <UserGroupIcon className="h-8 w-8 text-base-content/50 mx-auto mb-2" />
                    <p className="text-sm">Connect wallet to access actions</p>
                  </div>
                )}
              </div>
            </div>

            {/* DAO Stats */}
            <div className="bg-base-100 rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">DAO Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70">Active Proposals</span>
                  <span className="font-semibold">
                    {recentProposals.filter(p => p.isActive).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70">Approval Rate</span>
                  <span className="font-semibold">
                    {recentProposals.length > 0 
                      ? Math.round((recentProposals.filter(p => !p.isActive && p.votesFor > p.votesAgainst).length / 
                          recentProposals.filter(p => !p.isActive).length) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70">Avg. Participation</span>
                  <span className="font-semibold">
                    {recentProposals.length > 0 
                      ? Math.round(recentProposals.reduce((acc, p) => acc + Number(p.votesFor) + Number(p.votesAgainst), 0) / recentProposals.length)
                      : 0} votes
                  </span>
                </div>
              </div>
            </div>

            {/* Your Status */}
            <div className="bg-base-100 rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Your Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-70">Membership</span>
                  <div className={`badge ${isMember ? 'badge-success' : 'badge-error'}`}>
                    {isMember ? 'Active Member' : 'Not Member'}
                  </div>
                </div>
                {isMember && currentUserMember && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-70">Voting Power</span>
                      <span className="font-semibold">{currentUserMember[2]?.toString() || "0"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-70">Member Since</span>
                      <span className="font-semibold">
                        {currentUserMember[1] 
                          ? new Date(Number(currentUserMember[1]) * 1000).toLocaleDateString()
                          : "Unknown"
                        }
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 
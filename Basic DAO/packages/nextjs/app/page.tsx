"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { UserGroupIcon, DocumentTextIcon, MagnifyingGlassIcon, CogIcon, ChartBarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  // Read contract data for stats
  const { data: memberCount } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "getTotalProposals",
  });

  const { data: nextProposalId } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "nextProposalId",
  });

  const { data: balance } = useScaffoldReadContract({
    contractName: "SimpleDAO",
    functionName: "getBalance",
  });

  const features = [
    {
      icon: <DocumentTextIcon className="h-8 w-8" />,
      title: "Create Proposals",
      description: "Submit proposals for community decisions and fund allocations",
      href: "/proposals",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: <UserGroupIcon className="h-8 w-8" />,
      title: "Manage Members",
      description: "Add, remove members and manage voting rights",
      href: "/members",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: <CogIcon className="h-8 w-8" />,
      title: "Governance",
      description: "Access treasury management and governance settings",
      href: "/governance",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: <MagnifyingGlassIcon className="h-8 w-8" />,
      title: "Block Explorer",
      description: "Explore transactions and contract interactions",
      href: "/blockexplorer",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        {/* Hero Section */}
        <div className="px-5 w-full max-w-6xl">
          <div className="text-center mb-16">
            <div className="mb-6">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                Simple DAO
              </h1>
              <p className="text-xl text-base-content/80 max-w-2xl mx-auto leading-relaxed">
                A decentralized autonomous organization where members can create proposals, 
                vote on decisions, and execute community-driven actions with transparency and security.
              </p>
            </div>

            {/* Connection Status */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="flex items-center gap-3 bg-base-100 rounded-2xl px-6 py-4 shadow-lg">
                <div className={`w-3 h-3 rounded-full ${connectedAddress ? 'bg-success' : 'bg-error'}`}></div>
                <span className="font-medium">
                  {connectedAddress ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              {connectedAddress && (
                <div className="bg-base-100 rounded-2xl px-6 py-4 shadow-lg">
                  <Address address={connectedAddress} />
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-base-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center mb-3">
                  <DocumentTextIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-1">
                  {nextProposalId ? (Number(nextProposalId) - 1).toString() : "0"}
                </h3>
                <p className="text-sm text-base-content/70">Total Proposals</p>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center mb-3">
                  <UserGroupIcon className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-1">
                  {memberCount?.toString() || "0"}
                </h3>
                <p className="text-sm text-base-content/70">Active Members</p>
              </div>
              <div className="bg-base-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center mb-3">
                  <ChartBarIcon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-accent mb-1">
                  {balance ? `${Number(balance) / 1e18} ETH` : "0 ETH"}
                </h3>
                <p className="text-sm text-base-content/70">Treasury Balance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="w-full bg-gradient-to-b from-base-200 to-base-300 py-16">
          <div className="px-5 w-full max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">DAO Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Link key={index} href={feature.href} className="group">
                  <div className={`bg-base-100 rounded-2xl p-6 h-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 ${feature.bgColor}`}>
                    <div className={`flex items-center justify-center mb-4 w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} text-white mx-auto`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-center mb-3">{feature.title}</h3>
                    <p className="text-sm text-base-content/70 text-center leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex justify-center mt-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="w-full py-16">
          <div className="px-5 w-full max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Create Proposal</h3>
                <p className="text-base-content/70">
                  Members can submit proposals for community decisions, fund transfers, or governance changes.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Vote & Discuss</h3>
                <p className="text-base-content/70">
                  Members vote on proposals during the voting period. Quorum must be reached for valid results.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Execute Decision</h3>
                <p className="text-base-content/70">
                  Approved proposals are executed automatically, transferring funds or executing contract calls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { 
  TrophyIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlayIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { formatEther } from "viem";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { data: platformStats } = useScaffoldReadContract({
    contractName: "RockPaperScissors",
    functionName: "getPlatformStats",
  });

  const { data: playerStats } = useScaffoldReadContract({
    contractName: "RockPaperScissors",
    functionName: "getPlayerStats",
    args: [connectedAddress],
  });

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">🎮 Rock Paper Scissors</span>
          </h1>
          <p className="text-center text-lg mt-4">
            A provably fair Rock Paper Scissors game with betting capabilities on Base mainnet.
          </p>
          <div className="flex justify-center items-center space-x-2 flex-col mt-6">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grow bg-base-300 w-full mt-8 px-8 py-8">
          <h2 className="text-2xl font-bold text-center mb-6">📊 Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-base-100 p-4 rounded-lg text-center">
              <TrophyIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-gray-600">Total Games</p>
              <p className="text-xl font-bold">{platformStats?.[0]?.toString() || "0"}</p>
            </div>
            <div className="bg-base-100 p-4 rounded-lg text-center">
              <CurrencyDollarIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="text-xl font-bold">{platformStats?.[1] ? formatEther(platformStats[1]) : "0"} ETH</p>
            </div>
            <div className="bg-base-100 p-4 rounded-lg text-center">
              <ChartBarIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-gray-600">Platform Fee</p>
              <p className="text-xl font-bold">{platformStats?.[2] ? (Number(platformStats[2]) / 100).toString() : "0"}%</p>
            </div>
            <div className="bg-base-100 p-4 rounded-lg text-center">
              <UserGroupIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-gray-600">Your Wins</p>
              <p className="text-xl font-bold">{playerStats?.toString() || "0"}</p>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grow bg-base-300 w-full px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <PlayIcon className="h-8 w-8 fill-secondary" />
              <p>
                Play Rock Paper Scissors with the{" "}
                <Link href="/games" passHref className="link">
                  Game Manager
                </Link>{" "}
                interface.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <InformationCircleIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>

        {/* Game Rules */}
        <div className="grow bg-base-300 w-full px-8 py-8">
          <h2 className="text-2xl font-bold text-center mb-6">📋 How to Play</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-base-100 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-3">1. Create or Join</h3>
              <p className="text-sm">Create a new game with your choice and bet amount, or join an existing game by matching the bet.</p>
            </div>
            <div className="bg-base-100 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-3">2. Commit & Reveal</h3>
              <p className="text-sm">Your choice is hidden using a commitment scheme. Reveal it later with the same nonce to prove fairness.</p>
            </div>
            <div className="bg-base-100 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-3">3. Win & Claim</h3>
              <p className="text-sm">Rock beats Scissors, Scissors beats Paper, Paper beats Rock. Winner takes the pot minus 2% platform fee.</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Home;

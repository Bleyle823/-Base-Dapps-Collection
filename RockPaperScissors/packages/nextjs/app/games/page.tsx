"use client";

import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { 
  TrophyIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { parseEther, formatEther } from "viem";
import { ethers } from "ethers";

const GamesPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [selectedChoice, setSelectedChoice] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<string>("0.001");
  const [gameId, setGameId] = useState<string>("");
  const [nonce, setNonce] = useState<string>("");
  const [revealChoice, setRevealChoice] = useState<number>(0);
  const [revealNonce, setRevealNonce] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [playerGames, setPlayerGames] = useState<number[]>([]);
  const [gameDetails, setGameDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("create");

  // Contract hooks
  const { writeContractAsync: writeRockPaperScissorsAsync } = useScaffoldWriteContract({
    contractName: "RockPaperScissors",
  });

  const { data: platformStats } = useScaffoldReadContract({
    contractName: "RockPaperScissors",
    functionName: "getPlatformStats",
  });

  const { data: playerStats } = useScaffoldReadContract({
    contractName: "RockPaperScissors",
    functionName: "getPlayerStats",
    args: [connectedAddress],
  });

  const { data: minBet } = useScaffoldReadContract({
    contractName: "RockPaperScissors",
    functionName: "MIN_BET",
  });

  const { data: maxBet } = useScaffoldReadContract({
    contractName: "RockPaperScissors",
    functionName: "MAX_BET",
  });

  const { data: openGamesData } = useScaffoldReadContract({
    contractName: "RockPaperScissors",
    functionName: "getOpenGames",
    args: [0, 20],
  });

  const { data: playerGamesData } = useScaffoldReadContract({
    contractName: "RockPaperScissors",
    functionName: "getPlayerGames",
    args: [connectedAddress],
  });

  const { data: gameDetailsData } = useScaffoldReadContract({
    contractName: "RockPaperScissors",
    functionName: "getGame",
    args: selectedGame ? [BigInt(selectedGame)] : undefined,
  });

  // Generate commitment hash
  const generateCommitment = async (choice: number, nonce: string, player: string) => {
    if (!choice || !nonce || !player) return "0x";
    
    try {
      const commitment = ethers.utils.solidityKeccak256(
        ["uint8", "uint256", "address"],
        [choice, nonce, player]
      );
      return commitment;
    } catch (error) {
      console.error("Error generating commitment:", error);
      return "0x";
    }
  };

  // Create game
  const createGame = async () => {
    if (!selectedChoice || !betAmount || !nonce || !connectedAddress) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const commitment = await generateCommitment(selectedChoice, nonce, connectedAddress);
      if (commitment === "0x") {
        alert("Error generating commitment");
        return;
      }

      await writeRockPaperScissorsAsync({
        functionName: "createGame",
        args: [commitment],
        value: parseEther(betAmount),
      });

      alert("Game created successfully!");
      setSelectedChoice(0);
      setBetAmount("0.001");
      setNonce("");
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Error creating game");
    }
  };

  // Join game
  const joinGame = async () => {
    if (!selectedGame || !selectedChoice || !nonce || !connectedAddress) {
      alert("Please select a game and fill in all fields");
      return;
    }

    try {
      const commitment = await generateCommitment(selectedChoice, nonce, connectedAddress);
      if (commitment === "0x") {
        alert("Error generating commitment");
        return;
      }

      await writeRockPaperScissorsAsync({
        functionName: "joinGame",
        args: [BigInt(selectedGame), commitment],
        value: gameDetails?.betAmount || parseEther("0.001"),
      });

      alert("Joined game successfully!");
      setSelectedGame(null);
      setSelectedChoice(0);
      setNonce("");
    } catch (error) {
      console.error("Error joining game:", error);
      alert("Error joining game");
    }
  };

  // Reveal choice
  const revealChoice = async () => {
    if (!gameId || !revealChoice || !revealNonce) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await writeRockPaperScissorsAsync({
        functionName: "revealChoice",
        args: [BigInt(gameId), revealChoice, BigInt(revealNonce)],
      });

      alert("Choice revealed successfully!");
      setGameId("");
      setRevealChoice(0);
      setRevealNonce("");
    } catch (error) {
      console.error("Error revealing choice:", error);
      alert("Error revealing choice");
    }
  };

  // Claim timeout prize
  const claimTimeoutPrize = async () => {
    if (!gameId) {
      alert("Please enter a game ID");
      return;
    }

    try {
      await writeRockPaperScissorsAsync({
        functionName: "claimTimeoutPrize",
        args: [BigInt(gameId)],
      });

      alert("Timeout prize claimed successfully!");
      setGameId("");
    } catch (error) {
      console.error("Error claiming timeout prize:", error);
      alert("Error claiming timeout prize");
    }
  };

  // Update data when contract data changes
  useEffect(() => {
    if (playerGamesData) {
      setPlayerGames(playerGamesData as number[]);
    }
  }, [playerGamesData]);

  useEffect(() => {
    if (gameDetailsData) {
      setGameDetails(gameDetailsData);
    }
  }, [gameDetailsData]);

  // Refresh data
  const refreshData = () => {
    // The hooks will automatically refresh when the component re-renders
    window.location.reload();
  };

  const choices = ["None", "Rock", "Paper", "Scissors"];
  const gameStates = ["Open", "Committed", "Revealed", "Finished"];

  const renderCreateGame = () => (
    <div className="bg-base-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">🎯 Create New Game</h3>
      <div className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Your Choice</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={selectedChoice}
            onChange={(e) => setSelectedChoice(Number(e.target.value))}
          >
            <option value={0}>Select Choice</option>
            <option value={1}>Rock</option>
            <option value={2}>Paper</option>
            <option value={3}>Scissors</option>
          </select>
        </div>
        <div>
          <label className="label">
            <span className="label-text">Bet Amount (ETH)</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            min={minBet ? formatEther(minBet) : "0.001"}
            max={maxBet ? formatEther(maxBet) : "10"}
            step="0.001"
          />
          <p className="text-xs text-gray-500 mt-1">
            Min: {minBet ? formatEther(minBet) : "0.001"} ETH | Max: {maxBet ? formatEther(maxBet) : "10"} ETH
          </p>
        </div>
        <div>
          <label className="label">
            <span className="label-text">Nonce (Random Number)</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={nonce}
            onChange={(e) => setNonce(e.target.value)}
            placeholder="Enter a random number"
          />
        </div>
        <button 
          className="btn btn-primary w-full"
          onClick={createGame}
          disabled={!selectedChoice || !betAmount || !nonce}
        >
          Create Game
        </button>
      </div>
    </div>
  );

  const renderJoinGame = () => (
    <div className="bg-base-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">🎮 Join Game</h3>
      <div className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Select Game</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={selectedGame || ""}
            onChange={(e) => setSelectedGame(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Select a game to join</option>
            {openGamesData?.map((gameId: number) => (
              <option key={gameId} value={gameId}>Game #{gameId}</option>
            ))}
          </select>
        </div>
        {gameDetails && (
          <div className="bg-base-200 p-3 rounded">
            <p><strong>Bet Amount:</strong> {formatEther(gameDetails.betAmount)} ETH</p>
            <p><strong>Player 1:</strong> <Address address={gameDetails.player1} /></p>
            <p><strong>State:</strong> {gameStates[gameDetails.state]}</p>
          </div>
        )}
        <div>
          <label className="label">
            <span className="label-text">Your Choice</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={selectedChoice}
            onChange={(e) => setSelectedChoice(Number(e.target.value))}
          >
            <option value={0}>Select Choice</option>
            <option value={1}>Rock</option>
            <option value={2}>Paper</option>
            <option value={3}>Scissors</option>
          </select>
        </div>
        <div>
          <label className="label">
            <span className="label-text">Nonce (Random Number)</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={nonce}
            onChange={(e) => setNonce(e.target.value)}
            placeholder="Enter a random number"
          />
        </div>
        <button 
          className="btn btn-secondary w-full"
          onClick={joinGame}
          disabled={!selectedGame || !selectedChoice || !nonce}
        >
          Join Game
        </button>
      </div>
    </div>
  );

  const renderRevealChoice = () => (
    <div className="bg-base-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">🔓 Reveal Choice</h3>
      <div className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Game ID</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="Enter game ID"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Your Choice</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={revealChoice}
            onChange={(e) => setRevealChoice(Number(e.target.value))}
          >
            <option value={0}>Select Choice</option>
            <option value={1}>Rock</option>
            <option value={2}>Paper</option>
            <option value={3}>Scissors</option>
          </select>
        </div>
        <div>
          <label className="label">
            <span className="label-text">Nonce (Same as used in commitment)</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={revealNonce}
            onChange={(e) => setRevealNonce(e.target.value)}
            placeholder="Enter the same nonce used in commitment"
          />
        </div>
        <button 
          className="btn btn-accent w-full"
          onClick={revealChoice}
          disabled={!gameId || !revealChoice || !revealNonce}
        >
          Reveal Choice
        </button>
      </div>
    </div>
  );

  const renderClaimTimeout = () => (
    <div className="bg-base-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">⏰ Claim Timeout Prize</h3>
      <div className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Game ID</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="Enter game ID"
          />
        </div>
        <p className="text-sm text-gray-600">
          Claim your prize if your opponent doesn't reveal their choice within the timeout period.
        </p>
        <button 
          className="btn btn-warning w-full"
          onClick={claimTimeoutPrize}
          disabled={!gameId}
        >
          Claim Timeout Prize
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Game Management</span>
            <span className="block text-4xl font-bold">🎮 Rock Paper Scissors</span>
          </h1>
          <p className="text-center text-lg mt-4">
            Create, join, and manage your Rock Paper Scissors games
          </p>
          <div className="flex justify-center items-center space-x-2 flex-col mt-6">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grow bg-base-300 w-full mt-8 px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">📊 Platform Statistics</h2>
            <button 
              className="btn btn-sm btn-outline"
              onClick={refreshData}
            >
              🔄 Refresh
            </button>
          </div>
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

        {/* Game Actions */}
        <div className="grow bg-base-300 w-full px-8 py-8">
          <div className="tabs tabs-boxed justify-center mb-6">
            <button 
              className={`tab ${activeTab === "create" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("create")}
            >
              Create Game
            </button>
            <button 
              className={`tab ${activeTab === "join" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("join")}
            >
              Join Game
            </button>
            <button 
              className={`tab ${activeTab === "reveal" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("reveal")}
            >
              Reveal Choice
            </button>
            <button 
              className={`tab ${activeTab === "timeout" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("timeout")}
            >
              Claim Timeout
            </button>
          </div>

          <div className="max-w-2xl mx-auto">
            {activeTab === "create" && renderCreateGame()}
            {activeTab === "join" && renderJoinGame()}
            {activeTab === "reveal" && renderRevealChoice()}
            {activeTab === "timeout" && renderClaimTimeout()}
          </div>
        </div>

        {/* Player Game History */}
        {playerGames.length > 0 && (
          <div className="grow bg-base-300 w-full px-8 py-8">
            <h2 className="text-2xl font-bold text-center mb-6">📜 Your Game History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playerGames.slice(-6).map((gameId) => (
                <div key={gameId} className="bg-base-100 p-4 rounded-lg">
                  <h3 className="font-bold">Game #{gameId}</h3>
                  <p className="text-sm text-gray-600">Click to view details</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default GamesPage; 
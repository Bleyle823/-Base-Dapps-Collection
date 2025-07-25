import React from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { DonationForm } from "./DonationForm";

export function CampaignDetail({ campaignId }: { campaignId: string }) {
  const { data: campaign } = useScaffoldReadContract({
    contractName: "DonationApp",
    functionName: "getCampaign",
    args: [BigInt(campaignId)],
  });

  // The return type is a tuple, map it to named variables for clarity
  // [title, description, beneficiary, goal, raised, deadline, active, goalReached, donorCount, creator, createdAt]
  let title = "", description = "", beneficiary = "", goal = 0n, raised = 0n, deadline = 0n, active = false, goalReached = false, donorCount = 0n, creator = "", createdAt = 0n;
  if (Array.isArray(campaign)) {
    [title, description, beneficiary, goal, raised, deadline, active, goalReached, donorCount, creator, createdAt] = campaign as [string, string, string, bigint, bigint, bigint, boolean, boolean, bigint, string, bigint];
  }

  // TODO: Fetch donations for this campaign

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Campaign Details</h1>
      {campaign ? (
        <div className="bg-base-100 rounded-xl shadow-lg p-6 mb-8 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-base-content/80">{description}</p>
          <div className="flex flex-wrap gap-4 mt-2">
            <span><b>Goal:</b> {goal ? (Number(goal) / 1e18).toLocaleString() : "-"} ETH</span>
            <span><b>Raised:</b> {raised ? (Number(raised) / 1e18).toLocaleString() : "-"} ETH</span>
            <span><b>Deadline:</b> {deadline ? new Date(Number(deadline) * 1000).toLocaleString() : "-"}</span>
            <span><b>Status:</b> {active ? "Active" : "Inactive"}</span>
          </div>
        </div>
      ) : (
        <div className="text-center text-base-content/70">Loading campaign...</div>
      )}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Donate to this campaign</h3>
        <DonationForm campaignId={campaignId} />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Donations</h3>
        {/* TODO: Donations list */}
        <div className="bg-base-100 rounded-xl p-4 text-base-content/70">Coming soon...</div>
      </div>
    </div>
  );
}

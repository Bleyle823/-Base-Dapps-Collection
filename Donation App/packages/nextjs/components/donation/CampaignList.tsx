import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { CampaignCard } from "./CampaignCard";

export function CampaignList() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const { data: totalCampaigns } = useScaffoldReadContract({ contractName: "DonationApp", functionName: "totalCampaigns" });

  // Fetch all campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!totalCampaigns) return;
      const ids = Array.from({ length: Number(totalCampaigns) }, (_, i) => i);
      const campaignPromises = ids.map(async (id) => {
        // Use the contract read hook for each campaign
        // For demo, just return id; integrate multicall or batch read for production
        return { id, title: `Campaign #${id + 1}`, description: "", goal: "-", raised: "-", deadline: "-" };
      });
      const result = await Promise.all(campaignPromises);
      setCampaigns(result);
    };
    fetchCampaigns();
  }, [totalCampaigns]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Campaigns</h1>
        <Link href="/campaigns/create" className="btn btn-primary">+ Create Campaign</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.length === 0 ? (
          <div className="col-span-full text-center text-base-content/70">No campaigns found.</div>
        ) : (
          campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)
        )}
      </div>
    </div>
  );
}

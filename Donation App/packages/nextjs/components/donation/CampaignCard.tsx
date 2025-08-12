import React from "react";
import Link from "next/link";

export function CampaignCard({ campaign }: { campaign: any }) {
  return (
    <div className="bg-base-100 rounded-xl shadow-lg p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-2">{campaign.title}</h2>
      <p className="text-base-content/80 mb-2">{campaign.description}</p>
      <div className="flex flex-col gap-2 mb-2">
        <span><b>Goal:</b> {campaign.goal} ETH</span>
        <span><b>Raised:</b> {campaign.raised} ETH</span>
        <span><b>Deadline:</b> {campaign.deadline}</span>
      </div>
      <Link href={`/campaigns/${campaign.id}`} className="btn btn-secondary mt-auto">View Details</Link>
    </div>
  );
}

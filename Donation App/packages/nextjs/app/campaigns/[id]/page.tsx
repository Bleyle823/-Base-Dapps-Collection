"use client";
import { CampaignDetail } from "../../../components/donation/CampaignDetail";

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  return <CampaignDetail campaignId={params.id} />;
}

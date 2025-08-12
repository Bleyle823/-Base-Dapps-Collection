"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BanknotesIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { CampaignList } from "../components/donation/CampaignList";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex flex-col items-center min-h-screen bg-base-200">
      <header className="w-full py-12 bg-primary text-primary-content text-center shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4 flex justify-center items-center gap-4">
          <BanknotesIcon className="h-10 w-10" />
          Donation Platform
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          Create, explore, and support fundraising campaigns with transparent blockchain donations. Join, donate, or start your own campaign today!
        </p>
        <div className="mt-6">
          <Link href="/campaigns/create" className="btn btn-accent btn-lg font-semibold shadow-md">+ Start a Campaign</Link>
        </div>
      </header>
      <main className="w-full max-w-7xl px-4 py-12">
        <CampaignList />
      </main>
    </div>
  );
};

export default Home;

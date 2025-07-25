"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { UserGroupIcon, DocumentTextIcon, MagnifyingGlassIcon, CogIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Simple DAO</span>
          </h1>
          <p className="text-center text-lg mt-4">
            A decentralized autonomous organization where members can create proposals, vote on decisions, and execute community-driven actions.
          </p>
          <div className="flex justify-center items-center space-x-2 flex-col mt-6">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>

        <div className="grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-8 flex-col md:flex-row flex-wrap">
            <div className="flex flex-col bg-base-100 px-8 py-8 text-center items-center max-w-xs rounded-3xl">
              <DocumentTextIcon className="h-8 w-8 fill-secondary" />
              <p>
                Create and manage{" "}
                <Link href="/proposals" passHref className="link">
                  Proposals
                </Link>{" "}
                for the DAO community.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-8 py-8 text-center items-center max-w-xs rounded-3xl">
              <UserGroupIcon className="h-8 w-8 fill-secondary" />
              <p>
                Manage DAO{" "}
                <Link href="/members" passHref className="link">
                  Members
                </Link>{" "}
                and voting rights.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-8 py-8 text-center items-center max-w-xs rounded-3xl">
              <CogIcon className="h-8 w-8 fill-secondary" />
              <p>
                Access DAO{" "}
                <Link href="/governance" passHref className="link">
                  Governance
                </Link>{" "}
                settings and treasury.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-8 py-8 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

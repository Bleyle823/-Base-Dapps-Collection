import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposalId = parseInt(params.id);
    
    if (isNaN(proposalId) || proposalId < 1) {
      return NextResponse.json({ error: "Invalid proposal ID" }, { status: 400 });
    }

    const contract = deployedContracts[8453].SimpleDAO;
    
    // Get proposal data
    const proposalData = await publicClient.readContract({
      address: contract.address as `0x${string}`,
      abi: contract.abi,
      functionName: "getProposal",
      args: [BigInt(proposalId)],
    });

    if (!proposalData || !proposalData[0]) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    const [
      id,
      proposer,
      description,
      amount,
      recipient,
      votesFor,
      votesAgainst,
      startTime,
      endTime,
      executed,
      isActive
    ] = proposalData as [bigint, string, string, bigint, string, bigint, bigint, bigint, bigint, boolean, boolean];

    const proposal = {
      id: Number(id),
      proposer,
      description,
      amount: amount.toString(),
      recipient,
      votesFor: votesFor.toString(),
      votesAgainst: votesAgainst.toString(),
      startTime: startTime.toString(),
      endTime: endTime.toString(),
      executed,
      isActive,
    };

    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return NextResponse.json({ error: "Failed to fetch proposal" }, { status: 500 });
  }
}

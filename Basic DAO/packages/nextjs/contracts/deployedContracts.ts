/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  8453: {
    SimpleDAO: {
      address: "0xC3F336517fAB1c17BFCcDE6AF5B42c81D3ef5770",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "AlreadyExecuted",
          type: "error",
        },
        {
          inputs: [],
          name: "AlreadyMember",
          type: "error",
        },
        {
          inputs: [],
          name: "AlreadyVoted",
          type: "error",
        },
        {
          inputs: [],
          name: "NotMember",
          type: "error",
        },
        {
          inputs: [],
          name: "OnlyAdmin",
          type: "error",
        },
        {
          inputs: [],
          name: "ProposalFailed",
          type: "error",
        },
        {
          inputs: [],
          name: "ProposalNotFound",
          type: "error",
        },
        {
          inputs: [],
          name: "QuorumNotMet",
          type: "error",
        },
        {
          inputs: [],
          name: "TransferFailed",
          type: "error",
        },
        {
          inputs: [],
          name: "VotingEnded",
          type: "error",
        },
        {
          inputs: [],
          name: "VotingNotEnded",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "member",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "votingPower",
              type: "uint256",
            },
          ],
          name: "MemberAdded",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "member",
              type: "address",
            },
          ],
          name: "MemberRemoved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "proposalId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "proposer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "string",
              name: "description",
              type: "string",
            },
          ],
          name: "ProposalCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "proposalId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "success",
              type: "bool",
            },
          ],
          name: "ProposalExecuted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "proposalId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "voter",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "support",
              type: "bool",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "votingPower",
              type: "uint256",
            },
          ],
          name: "VoteCast",
          type: "event",
        },
        {
          inputs: [],
          name: "MIN_VOTING_POWER",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "VOTING_PERIOD",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_member",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_votingPower",
              type: "uint256",
            },
          ],
          name: "addMember",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "admin",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_description",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
            {
              internalType: "address payable",
              name: "_recipient",
              type: "address",
            },
          ],
          name: "createProposal",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "emergencyWithdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_proposalId",
              type: "uint256",
            },
          ],
          name: "executeProposal",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "getBalance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_proposalId",
              type: "uint256",
            },
          ],
          name: "getProposal",
          outputs: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "proposer",
              type: "address",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "votesFor",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "votesAgainst",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "startTime",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "endTime",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "executed",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "isActive",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getTotalVotingPower",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_proposalId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "_voter",
              type: "address",
            },
          ],
          name: "hasVoted",
          outputs: [
            {
              internalType: "bool",
              name: "voted",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "choice",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "memberCount",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "members",
          outputs: [
            {
              internalType: "bool",
              name: "isMember",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "joinedAt",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "votingPower",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "nextProposalId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "proposals",
          outputs: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "proposer",
              type: "address",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "address payable",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "votesFor",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "votesAgainst",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "startTime",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "endTime",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "executed",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "exists",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "quorum",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_member",
              type: "address",
            },
          ],
          name: "removeMember",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_quorum",
              type: "uint256",
            },
          ],
          name: "setQuorum",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_proposalId",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "_support",
              type: "bool",
            },
          ],
          name: "vote",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ],
      inheritedFunctions: {},
      deployedOnBlock: 33305934,
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;

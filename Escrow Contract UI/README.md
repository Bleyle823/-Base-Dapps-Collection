# SimpleEscrow Contract

A simple and secure escrow smart contract deployed on **Base** blockchain.

## 🌐 Deployed Contract

**Contract Address:** `0x1d46BDD8C34A356fB369bB13e5D31B40c496F26a`

**🔗 View on BaseScan:** https://basescan.org/address/0x1d46bdd8c34a356fb369bb13e5d31b40c496f26a

## 🔵 Built on Base

This contract is deployed on **Base**, Coinbase's secure, low-cost, builder-friendly Ethereum L2. Base offers:
- ⚡ Fast transactions
- 💰 Low fees
- 🔒 Ethereum-level security
- 🌍 Easy onboarding

## 📋 Overview

SimpleEscrow is a trustless escrow contract that facilitates secure transactions between buyers and sellers with optional dispute resolution through a neutral arbiter.

## ✨ Features

- **Three-party system**: Buyer, Seller, and Arbiter
- **State management**: Tracks transaction phases
- **Dispute resolution**: Built-in arbitration system
- **Fund security**: Secure fund holding until conditions are met
- **Event logging**: Transparent transaction tracking

## 🚀 How It Works

1. **Deploy** contract with seller and arbiter addresses
2. **Deposit** funds from buyer
3. **Confirm** delivery to release funds to seller
4. **Dispute** resolution available if needed

## 🛠 Usage

```solidity
// Constructor parameters
constructor(address _seller, address _arbiter)

// Main functions
depositFunds() payable        // Buyer deposits funds
confirmDelivery()            // Buyer confirms and releases funds
raiseDispute()              // Either party can dispute
resolveDispute(address winner) // Arbiter resolves disputes
```

## 📊 Contract Details

- **Solidity Version:** ^0.8.19
- **License:** MIT
- **Gas Used:** 671,480
- **Network:** Base Mainnet

## 🔗 Links

- [BaseScan Explorer](https://basescan.org/address/0x1d46bdd8c34a356fb369bb13e5d31b40c496f26a)
- [Base Network](https://base.org/)

---

*Deployed on Base - The future of decentralized applications* 🔵

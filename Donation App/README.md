# DonationApp 🚀

A decentralized donation platform built on **Base blockchain** that enables transparent, secure, and efficient crowdfunding campaigns.

## 🌟 Features

- **Create Campaigns**: Launch fundraising campaigns with goals, deadlines, and detailed descriptions
- **Transparent Donations**: All donations are recorded on-chain with full transparency
- **Goal Tracking**: Real-time progress tracking with automatic goal achievement detection
- **Secure Withdrawals**: Only campaign beneficiaries can withdraw raised funds
- **Platform Fees**: Built-in fee structure (2.5% default) for platform sustainability
- **Campaign Management**: Creators can cancel campaigns (if no donations received)
- **Donor History**: Track all donations made by users across campaigns

## 🔗 Deployed on Base

**Contract Address**: [`0xfdBF3FE50ba9B88b096f900fB5871cc1fc3611dd`](https://basescan.org/address/0xfdbf3fe50ba9b88b096f900fb5871cc1fc3611dd)

Base blockchain offers:
- ⚡ Low transaction fees
- 🚀 Fast confirmation times  
- 🔒 Ethereum-level security
- 🌍 Built for global accessibility

## 🛠️ Core Functions

### For Campaign Creators
- `createCampaign()` - Launch new fundraising campaigns
- `cancelCampaign()` - Cancel campaigns with no donations
- `withdrawFunds()` - Withdraw raised funds (beneficiaries only)

### For Donors
- `donate()` - Contribute to campaigns with optional messages
- `getCampaignDonations()` - View all donations for a campaign
- `getUserDonations()` - Track personal donation history

### Public Views
- `getCampaign()` - Get detailed campaign information
- `getCampaignProgress()` - Check funding progress percentage
- `getActiveCampaigns()` - Browse active campaigns
- `getPlatformStats()` - View platform-wide statistics

## 🏗️ Smart Contract Architecture

```solidity
struct Campaign {
    string title;
    string description;
    address payable beneficiary;
    uint256 goal;
    uint256 raised;
    uint256 deadline;
    bool active;
    bool goalReached;
    uint256 donorCount;
    address creator;
    uint256 createdAt;
}
```

## 🔐 Security Features

- **Access Control**: Role-based permissions for creators, beneficiaries, and platform owner
- **Input Validation**: Comprehensive validation for all user inputs
- **Reentrancy Protection**: Safe withdrawal patterns implemented
- **Custom Errors**: Gas-efficient error handling
- **Emergency Controls**: Platform owner emergency functions

## 📊 Platform Statistics

Track real-time metrics:
- Total campaigns created
- Total donations amount (ETH)
- Total number of donations
- Platform fee collection
- Active campaign count

## 🚀 Getting Started

1. **Connect Wallet**: Connect your Web3 wallet to Base network
2. **Create Campaign**: Set title, description, goal, and deadline
3. **Share Campaign**: Share your campaign ID with potential donors
4. **Receive Donations**: Donors can contribute ETH directly to your campaign
5. **Withdraw Funds**: Beneficiaries can withdraw raised funds anytime

## 📝 License

MIT License - Built for the decentralized future on Base blockchain.

---

**Live Contract**: [View on BaseScan](https://basescan.org/address/0xfdbf3fe50ba9b88b096f900fb5871cc1fc3611dd)

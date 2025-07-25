# SimpleDAO

A decentralized autonomous organization (DAO) built with Solidity and Next.js. Create proposals, vote democratically, and execute decisions automatically on Base network.

## 🚀 Features

- **Democratic Governance**: Time-bound voting with configurable quorum
- **Treasury Management**: Built-in ETH treasury for funding proposals  
- **Web Interface**: Modern Next.js frontend for seamless interaction
- **Base Network**: Low fees and fast transactions on Ethereum L2

## 📋 Contract Details

- **Network**: Base (Chain ID: 8453)
- **Contract**: [`0xC3F336517fAB1c17BFCcDE6AF5B42c81D3ef5770`](https://basescan.org/address/0xc3f336517fab1c17bfccde6af5b42c81d3ef5770)
- **Voting Period**: 7 days
- **Default Quorum**: 51%

## 🛠 Tech Stack

- Solidity ^0.8.19 on Base Network
- Next.js with TypeScript frontend
- Hardhat development environment

## 🚀 Quick Start

### Prerequisites
- Node.js v16+, npm/yarn
- MetaMask with Base network added
- Base ETH for gas fees

### Installation

```bash
# Clone and install dependencies
git clone https://github.com/your-username/SimpleDAO.git
cd SimpleDAO
npm install

# Install frontend dependencies
cd nextjs && npm install

# Set up environment
cp .env.example .env.local
```

Add to `.env.local`:
```env
PRIVATE_KEY=your_private_key
BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_CHAIN_ID=8453
```

### Run the App

```bash
# Start frontend
cd nextjs
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and connect to Base network.

## 📖 Usage

### For Admins
- Add/remove members with voting power
- Set quorum percentage  
- Fund the DAO treasury

### For Members
- Create proposals (with optional fund transfers)
- Vote during 7-day periods
- Execute successful proposals

### Example Flow
1. Admin adds members → 2. Member creates proposal → 3. Members vote → 4. Execute after voting ends

## 🌐 Base Network Setup

Add Base to MetaMask:
```
Network: Base
RPC: https://mainnet.base.org
Chain ID: 8453
Symbol: ETH
Explorer: https://basescan.org
```

**Contract Links:**
- [View on Basescan](https://basescan.org/address/0xc3f336517fab1c17bfccde6af5b42c81d3ef5770)
- [Read Contract](https://basescan.org/address/0xc3f336517fab1c17bfccde6af5b42c81d3ef5770#readContract)
- [Write Contract](https://basescan.org/address/0xc3f336517fab1c17bfccde6af5b42c81d3ef5770#writeContract)

## 🔧 Key Functions

**Admin:** `addMember()`, `removeMember()`, `setQuorum()`  
**Members:** `createProposal()`, `vote()`  
**Anyone:** `executeProposal()`, `getProposal()`

## 🧪 Development

```bash
# Test contracts
npx hardhat test

# Deploy to Base
npx hardhat run scripts/deploy.js --network base

# Verify on Basescan
npx hardhat verify --network base [CONTRACT_ADDRESS]
```

## 🔐 Security

- Admin-controlled membership
- Double-vote prevention
- Quorum validation before execution
- Secure ETH transfers

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Submit pull request

---

**⚠️ Disclaimer**: Experimental software. Audit before mainnet use.

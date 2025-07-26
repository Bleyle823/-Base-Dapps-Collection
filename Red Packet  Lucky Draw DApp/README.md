# Random Packet Smart Contract

A decentralized random packet system built on Ethereum that allows users to create and open packets containing various rewards with verifiable randomness.

## 🎯 Overview

The Random Packet smart contract enables the creation of "packets" - containers with random rewards that can include ETH, ERC20 tokens, or NFTs. The system supports multiple randomness sources to ensure fair and unpredictable reward distribution.

## 🚀 Deployment Status

**Network:** Base Mainnet  
**Contract Address:** `0x0A708C4aB7ef649f9d0B80fd64cD59259ca012B8`  
**Explorer:** [View on BaseScan](https://basescan.org/address/0x0A708C4aB7ef649f9d0B80fd64cD59259ca012B8)  
**Deployment Transaction:** `0x2ddf70505f5432bbeb369613378d5f3da8c86d08dbbe4024e0d76100f544ea4f`  
**Gas Used:** 2,357,182  
**Status:** ✅ Successfully Deployed

## ✨ Features

### Multiple Randomness Sources
- **Block Hash Randomness** - Fast, gas-efficient (suitable for low-stakes packets)
- **Chainlink VRF** - Cryptographically secure randomness (recommended for high-value packets)
- **Commit-Reveal** - User-driven randomness with two-phase process

### Reward Types
- **ETH Packets** - Direct Ether rewards
- **Token Packets** - ERC20 token rewards
- **Mixed Packets** - Combination of ETH, tokens, and NFTs
- **Empty Packets** - For gamification without rewards

### Security Features
- Access control with owner and authorized creators
- Automatic expiry and refund mechanisms
- Emergency withdrawal capabilities
- Protection against common attacks

## 🏗️ Architecture

```
RandomPacket Contract
├── Packet Creation
│   ├── ETH Packets
│   ├── Token Packets
│   └── Mixed Packets
├── Randomness Sources
│   ├── Block Hash
│   ├── Chainlink VRF
│   └── Commit-Reveal
├── Reward Distribution
│   ├── ETH Transfer
│   ├── Token Transfer
│   └── NFT Transfer (future)
└── Administration
    ├── Access Control
    ├── Parameter Updates
    └── Emergency Functions
```

## 📦 Installation & Setup

### Prerequisites
- Node.js >= 16.0.0
- Hardhat or Foundry
- MetaMask or compatible wallet

### Contract Integration

1. **Add to your project:**
```bash
npm install @openzeppelin/contracts @chainlink/contracts
```

2. **Import the deployed contract:**
```typescript
// For TypeScript/Next.js projects
import deployedContracts from "../contracts/deployedContracts";

const randomPacketContract = deployedContracts[chainId].RandomPacket;
```

3. **Contract ABI is available in:**
```
../nextjs/contracts/deployedContracts.ts
```

## 🎮 Usage Examples

### Creating Packets

#### ETH Packet
```solidity
// Create a packet with 3 ETH rewards
uint256[] memory rewards = new uint256[](3);
rewards[0] = 0.1 ether;
rewards[1] = 0.05 ether;
rewards[2] = 0.02 ether;

uint256 packetId = randomPacket.createETHPacket{value: 0.17 ether}(3, rewards);
```

#### Token Packet
```solidity
// Create a packet with token rewards
address tokenAddress = 0x...; // Your ERC20 token
uint256[] memory amounts = new uint256[](2);
amounts[0] = 100 * 10**18; // 100 tokens
amounts[1] = 50 * 10**18;  // 50 tokens

uint256 packetId = randomPacket.createTokenPacket(tokenAddress, amounts, true); // true = use VRF
```

### Opening Packets

#### Regular Opening (Block Hash)
```solidity
randomPacket.openPacket(packetId);
```

#### VRF Opening (Secure)
```solidity
// Step 1: Request randomness
randomPacket.openPacketWithVRF(packetId);

// Step 2: Chainlink VRF will automatically fulfill and distribute reward
```

#### Commit-Reveal Opening
```solidity
// Step 1: Commit
bytes32 commitment = keccak256(abi.encodePacked(secretValue, nonce));
randomPacket.commitForPacket(packetId, commitment);

// Step 2: Reveal (within time window)
randomPacket.revealAndOpen(packetId, nonce, secretValue);
```

## 🔧 Configuration

### VRF Setup (for secure randomness)

```solidity
// Update VRF parameters (owner only)
randomPacket.setVRFParameters(
    keyHash,           // Chainlink VRF Key Hash
    subscriptionId,    // Your VRF subscription ID
    requestConfirmations, // Number of confirmations
    callbackGasLimit   // Gas limit for callback
);
```

### Access Control

```solidity
// Authorize packet creators
randomPacket.setAuthorizedCreator(creatorAddress, true);

// Set packet expiry time
randomPacket.setDefaultExpiryTime(7 days);
```

## 📊 Contract Interface

### Main Functions

| Function | Description | Gas Estimate |
|----------|-------------|--------------|
| `createETHPacket()` | Create ETH reward packet | ~150,000 |
| `createTokenPacket()` | Create token reward packet | ~180,000 |
| `openPacket()` | Open packet with block hash | ~80,000 |
| `openPacketWithVRF()` | Request VRF opening | ~120,000 |
| `commitForPacket()` | Commit phase for reveal | ~50,000 |
| `revealAndOpen()` | Reveal and open packet | ~100,000 |

### View Functions

```solidity
// Get packet details
function getPacket(uint256 packetId) external view returns (
    address creator,
    uint256 totalValue,
    uint256 createdAt,
    uint256 expiresAt,
    PacketStatus status,
    uint256 rewardCount
);

// Get user's packets
function getUserPackets(address user) external view returns (uint256[] memory);
```

## 🎯 Use Cases

- **Gaming Platforms** - Random loot boxes and reward systems
- **DeFi Protocols** - Gamified yield farming rewards
- **NFT Projects** - Random trait assignment and airdrops
- **Marketing Campaigns** - Viral marketing with random rewards
- **Community Events** - Fair distribution mechanisms

## ⚠️ Security Considerations

### Randomness Security
- **Block Hash**: Vulnerable to miner manipulation (use only for low-value packets)
- **Chainlink VRF**: Cryptographically secure but costs LINK tokens
- **Commit-Reveal**: Secure but requires user participation

### Best Practices
- Always use VRF for high-value packets
- Set appropriate expiry times
- Monitor for failed transactions
- Implement proper error handling in your frontend

## 🔍 Events

```solidity
event PacketCreated(uint256 indexed packetId, address indexed creator, uint256 totalValue);
event PacketOpened(uint256 indexed packetId, address indexed opener, uint256 reward, RewardType rewardType);
event RandomnessRequested(uint256 indexed requestId, uint256 indexed packetId);
event RandomnessFulfilled(uint256 indexed requestId, uint256 randomValue);
```

## 🛠️ Development

### Testing
```bash
# Run tests
npx hardhat test

# Test specific functionality
npx hardhat test --grep "RandomPacket"
```

### Verification
```bash
# Verify contract on BaseScan
npx hardhat verify --network base 0x0A708C4aB7ef649f9d0B80fd64cD59259ca012B8
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] NFT reward support
- [ ] Batch packet creation
- [ ] Packet marketplace
- [ ] Advanced statistics dashboard
- [ ] Mobile app integration
- [ ] Layer 2 optimization for Base
- [ ] Cross-chain packet bridging

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📞 Support

- **Documentation**: [Project Wiki](link-to-wiki)
- **Discord**: [Community Server](link-to-discord)
- **Issues**: [GitHub Issues](link-to-issues)
- **Email**: support@yourproject.com

## 🙏 Acknowledgments

- [Chainlink](https://chain.link/) for VRF services
- [OpenZeppelin](https://openzeppelin.com/) for security standards
- [Hardhat](https://hardhat.org/) for development framework

---

**Contract Address:** `0x0A708C4aB7ef649f9d0B80fd64cD59259ca012B8`  
**Network:** Base Mainnet  
**Explorer:** [BaseScan](https://basescan.org/address/0x0A708C4aB7ef649f9d0B80fd64cD59259ca012B8)  
**Version:** 1.0.0

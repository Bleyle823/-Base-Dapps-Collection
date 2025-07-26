# SimpleMultisig

A simple and secure multisignature wallet smart contract implementation that requires multiple signatures to execute transactions, providing enhanced security for cryptocurrency and token management.

## 🚀 Deployment Information

- **Contract Address**: `0x0b1bb2fDE2Bd465Fc3433B1f14e80B4a718751Ad`
- **Deployment Transaction**: `0xfb905eff4f5149eb020456a1cccc746d287e1871329dfb77c7ef3cfd66be95c3`
- **Gas Used**: 1,121,956
- **Status**: ✅ Successfully Deployed

## 📋 Overview

SimpleMultisig is a smart contract that implements a multisignature wallet, allowing multiple parties to collectively control funds and execute transactions. This adds an extra layer of security by requiring a predetermined number of signatures before any transaction can be executed.

### Key Features

- **Multi-signature Security**: Requires multiple approvals before executing transactions
- **Flexible Ownership**: Support for multiple owners with configurable signature thresholds
- **Transaction Queue**: Ability to propose, review, and execute transactions
- **Gas Efficient**: Optimized for minimal gas consumption
- **Transparent**: All transactions and approvals are recorded on-chain

## 🛠 Technology Stack

- **Smart Contract**: Solidity
- **Frontend**: Next.js with TypeScript
- **Development Framework**: Scaffold-ETH 2 (inferred from file structure)
- **Contract Definitions**: Auto-generated TypeScript definitions

## 📁 Project Structure

```
├── contracts/
│   └── SimpleMultisig.sol          # Main multisig contract
├── nextjs/
│   └── contracts/
│       └── deployedContracts.ts    # TypeScript contract definitions
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Clone the Repository

```bash
git clone <your-repository-url>
cd SimpleMultisig
npm install
```

### Environment Setup

1. Copy environment variables:
```bash
cp .env.example .env.local
```

2. Configure your environment variables:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0b1bb2fDE2Bd465Fc3433B1f14e80B4a718751Ad
```

## 🚀 Usage

### Frontend Interface

Start the Next.js development server:

```bash
cd nextjs
npm run dev
```

Visit `http://localhost:3000` to interact with the multisig wallet through the web interface.

### Contract Interaction

The deployed contract can be interacted with using the provided TypeScript definitions:

```typescript
import { deployedContracts } from "./contracts/deployedContracts";

// Access contract ABI and address
const multisigContract = deployedContracts[chainId].SimpleMultisig;
```

## 🔐 Security Features

- **Signature Threshold**: Configurable number of required signatures
- **Owner Management**: Add/remove owners through multisig consensus
- **Transaction Validation**: All transactions must be approved by required number of owners
- **Replay Protection**: Protection against transaction replay attacks

## 📖 Contract Functions

### Core Functions

- `submitTransaction()` - Propose a new transaction
- `confirmTransaction()` - Approve a pending transaction
- `executeTransaction()` - Execute a fully approved transaction
- `revokeConfirmation()` - Revoke a previous approval

### View Functions

- `getOwners()` - Get list of all owners
- `getTransactionCount()` - Get total number of transactions
- `getTransaction()` - Get transaction details
- `isConfirmed()` - Check if transaction is confirmed by an owner

## 🧪 Testing

Run the test suite:

```bash
# Run contract tests
npm run test

# Run with coverage
npm run test:coverage
```

## 📊 Gas Optimization

The contract has been optimized for gas efficiency:
- Deployment cost: 1,121,956 gas
- Optimized storage patterns
- Efficient signature verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Solidity best practices
- Write comprehensive tests
- Update documentation for new features
- Ensure gas efficiency

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This smart contract has been deployed for demonstration/testing purposes. Please conduct thorough security audits before using in production with real funds.

## 🔗 Links

- **Contract on Block Explorer**: [View Contract](https://etherscan.io/address/0x0b1bb2fDE2Bd465Fc3433B1f14e80B4a718751Ad)
- **Deployment Transaction**: [View Transaction](https://etherscan.io/tx/0xfb905eff4f5149eb020456a1cccc746d287e1871329dfb77c7ef3cfd66be95c3)

## 📞 Support

If you have questions or need support:

- Open an issue on GitHub
- Check the documentation
- Review existing issues and discussions

---

**Built with ❤️ using Scaffold-ETH 2**

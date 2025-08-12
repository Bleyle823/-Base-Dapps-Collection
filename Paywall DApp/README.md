## Paywall DApp — PiggyBank (Time‑Locked Savings)

This dApp lets users deposit ETH into a personal piggy bank and withdraw only after a chosen lock period. It includes a friendly UI, a local block explorer, and a debug view.

### Features

- Time‑locked savings with selectable durations (hour, day, week, month, year)
- Add funds to an existing lock
- Withdraw once unlocked; emergency withdraw with penalty
- Built‑in block explorer and contract debug pages

### Tech Stack

- Next.js, TypeScript, Tailwind/DaisyUI
- wagmi + viem + RainbowKit
- Hardhat + hardhat‑deploy
- Scaffold‑ETH 2 tooling

---

## Contracts

The frontend is wired to a `PiggyBank` contract via `packages/nextjs/contracts/deployedContracts.ts`:

- Base Mainnet (8453): `PiggyBank` at `0x4C3f2c2909C0E677ef0403b6B1dF09348431631d`
- Hardhat local (31337): `PiggyBank` at `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- Sepolia (11155111): `PiggyBank` at `0x45d98693F831809401AEc01694b9F6956ad553E8`

If you deploy a different address, update `packages/nextjs/contracts/deployedContracts.ts` accordingly.

Note: The Hardhat package currently contains `RandomPacket.sol` and a deploy script for `RandomPacket`. The UI in this app targets `PiggyBank`. You can either:

- Keep using the preconfigured `PiggyBank` addresses above; or
- Replace the deploy script and contract in `packages/hardhat` with `PiggyBank` and redeploy; or
- Modify the UI to interact with `RandomPacket` instead of `PiggyBank`.

---

## Quickstart

Prerequisites: Node 20+, Yarn 1.x, Git

1) Terminal A — Local chain

```bash
cd "Paywall DApp/packages/hardhat"
yarn
yarn chain
```

2) Terminal B — (Optional) Compile/deploy

```bash
cd "Paywall DApp/packages/hardhat"
yarn
yarn compile
# If you adapt the deploy script to PiggyBank, then:
# yarn deploy
```

3) Terminal C — Frontend

```bash
cd "Paywall DApp/packages/nextjs"
yarn
yarn start
# visit http://localhost:3000
```

---

## Using the App

- Connect your wallet and open the `PiggyBank` page.
- Create a piggy bank by depositing ETH and selecting a lock duration.
- Add funds anytime. Withdraw once the lock expires.
- Emergency withdraw is available with a penalty.

Key contract methods used by the UI:

- `createPiggyBank(uint256 lockSeconds)` (payable)
- `addFunds()` (payable)
- `withdraw()`
- `emergencyWithdraw()`
- `getPiggyBank(address user)` and `getTimeLeft(address user)`

---

## Developer Notes

- To fully align Hardhat with the UI, replace `packages/hardhat/contracts/RandomPacket.sol` with a `PiggyBank` contract and update `deploy/00_deploy_your_contract.ts` to deploy it.
- To target Base Mainnet or Sepolia from the UI, keep or update the addresses in `deployedContracts.ts`.

## License

MIT

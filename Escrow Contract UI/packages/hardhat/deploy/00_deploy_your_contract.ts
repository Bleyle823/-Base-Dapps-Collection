import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` or `yarn account:import` to import your
    existing PK which will fill DEPLOYER_PRIVATE_KEY_ENCRYPTED in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Use named accounts for seller and arbiter, fallback to deployer if not defined
const { seller, arbiter } = await hre.getNamedAccounts();
const sellerAddress = seller || deployer;
const arbiterAddress = arbiter || deployer;

await deploy("SimpleEscrow", {
  from: deployer,
  args: [sellerAddress, arbiterAddress],
  log: true,
  autoMine: true,
});

// Get the deployed contract to interact with it after deploying (optional)
const simpleEscrow = await hre.ethers.getContract<Contract>("SimpleEscrow", deployer);
console.log("SimpleEscrow deployed at:", simpleEscrow.target);

};

export default deployYourContract;

deployYourContract.tags = ["SimpleEscrow"];

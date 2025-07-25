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

  await deploy("RandomPacket", {
    from: deployer,
    // Contract constructor arguments: set to example values, user should update with real ones
    args: [
      "0x0000000000000000000000000000000000000000", // _vrfCoordinator
      "0x0000000000000000000000000000000000000000000000000000000000000000", // _keyHash
      0 // _subscriptionId
    ],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  // const randomPacket = await hre.ethers.getContract<Contract>("RandomPacket", deployer);
  // You can add post-deployment logic here if needed.
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["RandomPacket"];

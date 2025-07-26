import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the SimpleMultisig contract using the deployer account as the only owner by default.
 * You can edit the owners array and confirmations as needed for your deployment.
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

  // Define owners and number of confirmations required
  // TODO: Update owners as needed
  const owners = [deployer];
  const numConfirmationsRequired = 1;

  await deploy("SimpleMultisig", {
    from: deployer,
    args: [owners, numConfirmationsRequired],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const multisig = await hre.ethers.getContract<Contract>("SimpleMultisig", deployer);
  console.log("✅ SimpleMultisig deployed at:", multisig.address);
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["SimpleMultisig"];

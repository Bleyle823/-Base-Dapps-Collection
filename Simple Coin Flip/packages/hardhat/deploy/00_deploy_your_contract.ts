import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "RockPaperScissors" using the deployer account
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployRockPaperScissors: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
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

  await deploy("RockPaperScissors", {
    from: deployer,
    // Contract constructor arguments (none needed for RockPaperScissors)
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const rockPaperScissors = await hre.ethers.getContract<Contract>("RockPaperScissors", deployer);
  console.log("🎮 RockPaperScissors deployed at:", await rockPaperScissors.getAddress());
  
  // Get platform stats to verify deployment
  const stats = await rockPaperScissors.getPlatformStats();
  console.log("📊 Platform stats - Total games:", stats[0].toString(), "Total volume:", hre.ethers.formatEther(stats[1]), "ETH");
};

export default deployRockPaperScissors;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags RockPaperScissors
deployRockPaperScissors.tags = ["RockPaperScissors"];

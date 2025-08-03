import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "TokenGatedPage" using the deployer account and
 * constructor arguments set to a token address and minimum balance
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployTokenGatedPage: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
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

  // For testing purposes, we'll use a placeholder token address
  // In production, you would use the actual ERC20 token address
  const gatingTokenAddress = "0x0000000000000000000000000000000000000000"; // Replace with actual token address
  const minimumTokenBalance = hre.ethers.parseEther("1"); // 1 token minimum balance

  await deploy("TokenGatedPage", {
    from: deployer,
    // Contract constructor arguments
    args: [gatingTokenAddress, minimumTokenBalance],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const tokenGatedPage = await hre.ethers.getContract<Contract>("TokenGatedPage", deployer);
  console.log("🎫 TokenGatedPage deployed successfully!");
  console.log("📋 Contract info:", await tokenGatedPage.getContractInfo());
};

export default deployTokenGatedPage;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags TokenGatedPage
deployTokenGatedPage.tags = ["TokenGatedPage"];

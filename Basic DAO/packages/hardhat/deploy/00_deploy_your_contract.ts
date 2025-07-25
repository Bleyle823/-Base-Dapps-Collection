import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the SimpleDAO contract using the deployer account.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deploySimpleDAO: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("SimpleDAO", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const simpleDAO = await hre.ethers.getContract<Contract>("SimpleDAO", deployer);
  console.log("✅ SimpleDAO deployed at:", await simpleDAO.getAddress());
};

export default deploySimpleDAO;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags SimpleDAO
deploySimpleDAO.tags = ["SimpleDAO", "all"];
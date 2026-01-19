const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy DataVault
  const DataVault = await hre.ethers.getContractFactory("DataVault");
  const dataVault = await DataVault.deploy();
  await dataVault.waitForDeployment();
  const dataVaultAddress = await dataVault.getAddress();
  console.log("DataVault deployed to:", dataVaultAddress);

  // Deploy PermissionManager
  const PermissionManager = await hre.ethers.getContractFactory("PermissionManager");
  const permissionManager = await PermissionManager.deploy();
  await permissionManager.waitForDeployment();
  const permissionManagerAddress = await permissionManager.getAddress();
  console.log("PermissionManager deployed to:", permissionManagerAddress);

  // Deploy MicroEconomy
  const MicroEconomy = await hre.ethers.getContractFactory("MicroEconomy");
  const microEconomy = await MicroEconomy.deploy();
  await microEconomy.waitForDeployment();
  const microEconomyAddress = await microEconomy.getAddress();
  console.log("MicroEconomy deployed to:", microEconomyAddress);

  // Deploy AccessControl
  const AccessControl = await hre.ethers.getContractFactory("AccessControl");
  const accessControl = await AccessControl.deploy(dataVaultAddress, permissionManagerAddress);
  await accessControl.waitForDeployment();
  const accessControlAddress = await accessControl.getAddress();
  console.log("AccessControl deployed to:", accessControlAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("DataVault:", dataVaultAddress);
  console.log("PermissionManager:", permissionManagerAddress);
  console.log("MicroEconomy:", microEconomyAddress);
  console.log("AccessControl:", accessControlAddress);

  // Save addresses to a file for frontend use
  const fs = require("fs");
  const addresses = {
    DataVault: dataVaultAddress,
    PermissionManager: permissionManagerAddress,
    MicroEconomy: microEconomyAddress,
    AccessControl: accessControlAddress,
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId,
  };

  fs.writeFileSync(
    "./contracts/addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("\nAddresses saved to contracts/addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


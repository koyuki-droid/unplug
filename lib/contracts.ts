import { ethers } from "ethers";

// Try to import contract ABIs, fallback to empty arrays if artifacts not compiled
let DataVaultABI: any = { abi: [] };
let PermissionManagerABI: any = { abi: [] };
let MicroEconomyABI: any = { abi: [] };
let AccessControlABI: any = { abi: [] };

try {
  DataVaultABI = require("../artifacts/contracts/DataVault.sol/DataVault.json");
} catch (e) {
  console.warn("DataVault ABI not found - contracts may not be compiled");
}

try {
  PermissionManagerABI = require("../artifacts/contracts/PermissionManager.sol/PermissionManager.json");
} catch (e) {
  console.warn("PermissionManager ABI not found - contracts may not be compiled");
}

try {
  MicroEconomyABI = require("../artifacts/contracts/MicroEconomy.sol/MicroEconomy.json");
} catch (e) {
  console.warn("MicroEconomy ABI not found - contracts may not be compiled");
}

try {
  AccessControlABI = require("../artifacts/contracts/AccessControl.sol/AccessControl.json");
} catch (e) {
  console.warn("AccessControl ABI not found - contracts may not be compiled");
}

// Contract addresses (will be set after deployment)
// For now, using placeholder - these should come from addresses.json after deployment
const CONTRACT_ADDRESSES = {
  DataVault: process.env.NEXT_PUBLIC_DATA_VAULT_ADDRESS || "",
  PermissionManager: process.env.NEXT_PUBLIC_PERMISSION_MANAGER_ADDRESS || "",
  MicroEconomy: process.env.NEXT_PUBLIC_MICRO_ECONOMY_ADDRESS || "",
  AccessControl: process.env.NEXT_PUBLIC_ACCESS_CONTROL_ADDRESS || "",
};

/**
 * Get contract instance
 */
export function getContract(
  contractName: keyof typeof CONTRACT_ADDRESSES,
  signer: ethers.Signer
): ethers.Contract {
  const address = CONTRACT_ADDRESSES[contractName];
  if (!address) {
    throw new Error(`${contractName} address not configured`);
  }

  let abi;
  switch (contractName) {
    case "DataVault":
      abi = DataVaultABI.abi;
      break;
    case "PermissionManager":
      abi = PermissionManagerABI.abi;
      break;
    case "MicroEconomy":
      abi = MicroEconomyABI.abi;
      break;
    case "AccessControl":
      abi = AccessControlABI.abi;
      break;
    default:
      throw new Error(`Unknown contract: ${contractName}`);
  }

  if (!abi || abi.length === 0) {
    throw new Error(`${contractName} ABI not available - please compile contracts first`);
  }

  return new ethers.Contract(address, abi, signer);
}

/**
 * Get signer from provider
 */
export async function getSigner(): Promise<ethers.Signer> {
  if (typeof window === "undefined") {
    throw new Error("Must be called from browser");
  }

  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer;
}

/**
 * Create signature for permission granting (MetaMask-style)
 */
export async function createPermissionSignature(
  owner: string,
  grantee: string,
  recordId: number,
  expiryTime: number,
  permissionType: string,
  nonce: number
): Promise<string> {
  const signer = await getSigner();
  
  // Create message hash (same as in PermissionManager.sol)
  const message = ethers.solidityPackedKeccak256(
    ["address", "address", "uint256", "uint256", "string", "uint256", "address"],
    [
      owner,
      grantee,
      recordId,
      expiryTime,
      permissionType,
      nonce,
      CONTRACT_ADDRESSES.PermissionManager,
    ]
  );
  
  // Sign the message
  const signature = await signer.signMessage(ethers.getBytes(message));
  return signature;
}

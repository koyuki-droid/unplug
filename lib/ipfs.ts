// Web3.Storage client - using dynamic import for optional dependency
let Web3Storage: any = null;
try {
  Web3Storage = require("web3.storage").Web3Storage;
} catch (e) {
  console.warn("web3.storage not available - IPFS uploads will not work");
}

// Initialize Web3Storage client
// You'll need to add your API token to .env.local: NEXT_PUBLIC_WEB3_STORAGE_TOKEN
function makeStorageClient() {
  const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
  if (!token) {
    throw new Error("WEB3_STORAGE_TOKEN not found in environment variables");
  }
  return new Web3Storage({ token });
}

/**
 * Upload a file to IPFS via Web3.Storage
 * @param file File to upload
 * @returns IPFS CID (Content Identifier)
 */
export async function uploadToIPFS(file: File): Promise<string> {
  const client = makeStorageClient();
  
  // TODO: Encrypt file before uploading for privacy
  // For now, upload directly (production should encrypt)
  
  const cid = await client.put([file], {
    name: file.name,
    wrapWithDirectory: false,
  });
  
  return cid;
}

/**
 * Upload encrypted data to IPFS
 * @param encryptedData Encrypted file as ArrayBuffer or Blob
 * @param filename Filename for the encrypted data
 * @returns IPFS CID
 */
export async function uploadEncryptedToIPFS(
  encryptedData: ArrayBuffer | Blob,
  filename: string
): Promise<string> {
  const client = makeStorageClient();
  
  const file = new File([encryptedData], filename, {
    type: "application/octet-stream",
  });
  
  const cid = await client.put([file], {
    name: filename,
    wrapWithDirectory: false,
  });
  
  return cid;
}

/**
 * Retrieve file from IPFS
 * @param cid IPFS CID
 * @returns File data
 */
export async function getFromIPFS(cid: string): Promise<File> {
  const client = makeStorageClient();
  const res = await client.get(cid);
  
  if (!res || !res.ok) {
    throw new Error(`Failed to get ${cid}`);
  }
  
  const files = await res.files();
  if (files.length === 0) {
    throw new Error(`No files found for ${cid}`);
  }
  
  return files[0];
}

/**
 * Get IPFS gateway URL for a CID
 * @param cid IPFS CID
 * @returns URL to access file via IPFS gateway
 */
export function getIPFSGatewayURL(cid: string): string {
  // Using public IPFS gateway (for production, use your own gateway or encrypted)
  return `https://${cid}.ipfs.w3s.link`;
}


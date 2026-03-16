/**
 * @deprecated Use safeIPFSFetch from ipfsUtils instead
 */
import { safeIPFSFetch } from './ipfsUtils';

const DEFAULT_RESPONSE = {
  name: "Unknown",
  description: "Description unavailable"
};

/**
 * Fetch data from IPFS using the enhanced safety mechanisms
 * This is maintained for backward compatibility but redirects to safeIPFSFetch
 * @param CID The IPFS content identifier
 * @returns The file content or a default response if fetch fails
 */
export async function fetchFileFromIPFS(CID: string) {
  console.warn('fetchFileFromIPFS is deprecated, use safeIPFSFetch from ipfsUtils instead');
  return safeIPFSFetch(CID, DEFAULT_RESPONSE);
}

const GATEWAY = "gateway.pinata.cloud";
const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export async function fetchFileFromIPFS(CID: String) {
  if (!CID || CID === '') {
    console.error('Empty IPFS hash provided');
    return null;
  }

  if (!isValidIPFSHash(CID)) {
    console.error(`Invalid IPFS hash format: ${CID}`);
    return null;
  }

  const url = `https://${GATEWAY}/ipfs/${CID}`;
  try {
    const request = await fetch(url);
    if (!request.ok) {
      throw new Error(`HTTP error ${request.status}: ${await request.text()}`);
    }
    const response = await request.json();
    return response;
  } catch (error) {
    console.error(`Error fetching from IPFS: ${error}`);
    return null;
  }
}

/**
 * Validates if a string is a valid IPFS hash (CID)
 * Supports CIDv0 (base58 encoded) and CIDv1 (base32 encoded)
 */
export function isValidIPFSHash(hash: String): boolean {
  if (!hash || typeof hash !== 'string') return false;

  // Remove ipfs:// prefix if present
  const cleanHash = hash.replace(/^ipfs:\/\//, '');
  
  // CIDv0 starts with "Qm" and is 46 characters long
  const cidv0Regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
  
  // CIDv1 typically starts with "b" and uses base32 encoding
  const cidv1Regex = /^b[a-z2-7]{58}$/i;
  
  return cidv0Regex.test(cleanHash) || cidv1Regex.test(cleanHash);
}

/**
 * Checks if an IPFS resource exists by making a HEAD request
 */
export async function checkIPFSResource(hash: String): Promise<boolean> {
  if (!hash || !isValidIPFSHash(hash)) return false;
  
  try {
    const url = `https://${GATEWAY}/ipfs/${hash}`;
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Error checking IPFS resource: ${error}`);
    return false;
  }
}

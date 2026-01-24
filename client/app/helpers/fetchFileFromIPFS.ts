const GATEWAY = "orange-confused-boar-516.mypinata.cloud";

/**
 * Fetches a file from IPFS using the provided CID (Content Identifier)
 * @param CID - The IPFS Content Identifier (hash) of the file to fetch
 * @returns Promise that resolves to the parsed JSON content of the file
 * @throws Error if the fetch fails, response is not ok, or JSON parsing fails
 */
export async function fetchFileFromIPFS(CID: String) {
  const url = `https://${GATEWAY}/ipfs/${CID}`;
  try {
    const response = await fetch(url);
    
    // Check if the HTTP response was successful (status 200-299)
    if (!response.ok) {
      throw new Error(
        `Failed to fetch file from IPFS: ${response.status} ${response.statusText}`
      );
    }
    
    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Re-throw the error with additional context if it's not already an Error
    if (error instanceof Error) {
      throw new Error(`Error fetching IPFS file (CID: ${CID}): ${error.message}`);
    }
    throw new Error(`Unknown error fetching IPFS file (CID: ${CID})`);
  }
}

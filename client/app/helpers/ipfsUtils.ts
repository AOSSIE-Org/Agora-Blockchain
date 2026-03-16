/**
 * IPFS Utilities for handling IPFS operations with validation, caching, and fallbacks
 */

import { pinJSONFile, unpinJSONFile } from './pinToIPFS';

// Regular expression for validating IPFS CID v0 and v1
const IPFS_HASH_REGEX = /^(Qm[1-9A-Za-z]{44}|b[A-Za-z2-7]{58})$/;

// In-memory cache for IPFS data to reduce API calls
const ipfsCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_EXPIRY = 1000 * 60 * 10; // 10 minutes

/**
 * Validates an IPFS hash format
 * @param hash IPFS hash to validate
 * @returns boolean indicating if the hash is valid
 */
export const isValidIPFSHash = (hash: string): boolean => {
  if (!hash) return false;
  
  // Check format using regex
  return IPFS_HASH_REGEX.test(hash);
};

/**
 * Safely fetches data from IPFS with validation, caching, and fallback
 * @param hash IPFS hash to fetch
 * @param defaultValue Default value to return if fetch fails
 * @returns Retrieved data or default value
 */
export const safeIPFSFetch = async <T>(hash: string, defaultValue: T): Promise<T> => {
  // Validate hash first
  if (!isValidIPFSHash(hash)) {
    console.warn('Invalid IPFS hash format', hash);
    return defaultValue;
  }
  
  // Check cache first
  const cached = ipfsCache[hash];
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_EXPIRY) {
    return cached.data as T;
  }
  
  // Attempt to fetch from IPFS
  try {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
    
    if (!response.ok) {
      throw new Error(`IPFS fetch failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the successful result
    ipfsCache[hash] = { data, timestamp: now };
    
    return data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    
    // Try alternative gateway if primary fails
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${hash}`);
      
      if (!response.ok) {
        throw new Error(`Alternative IPFS fetch failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the successful result
      ipfsCache[hash] = { data, timestamp: now };
      
      return data;
    } catch (alternativeError) {
      console.error('Error fetching from alternative IPFS gateway:', alternativeError);
      return defaultValue;
    }
  }
};

/**
 * Safely stores data on IPFS with validation
 * @param data Data to store on IPFS
 * @returns IPFS hash or null if operation failed
 */
export const safeIPFSStore = async (data: any): Promise<string | null> => {
  if (!data) {
    console.error('Cannot store empty data on IPFS');
    return null;
  }
  
  try {
    const jsonBody = {
      pinataContent: data,
      pinataMetadata: {
        name: `Election Data ${Date.now()}`,
      },
    };
    
    const result = await pinJSONFile(jsonBody);
    
    // Validate the returned hash
    if (!isValidIPFSHash(result.IpfsHash)) {
      console.error('Invalid IPFS hash returned from pinata', result);
      return null;
    }
    
    // Pre-cache the data we just stored
    ipfsCache[result.IpfsHash] = { 
      data: data, 
      timestamp: Date.now() 
    };
    
    return result.IpfsHash;
  } catch (error) {
    console.error('Error storing data on IPFS:', error);
    return null;
  }
};

/**
 * Safely removes data from IPFS with validation
 * @param hash IPFS hash to unpin
 * @returns Boolean indicating operation success
 */
export const safeIPFSRemove = async (hash: string): Promise<boolean> => {
  // Validate hash first
  if (!isValidIPFSHash(hash)) {
    console.warn('Invalid IPFS hash format for removal', hash);
    return false;
  }
  
  try {
    await unpinJSONFile(hash);
    
    // Remove from cache if exists
    if (ipfsCache[hash]) {
      delete ipfsCache[hash];
    }
    
    return true;
  } catch (error) {
    console.error('Error removing data from IPFS:', error);
    return false;
  }
};

/**
 * Clears expired items from the IPFS cache
 */
export const cleanIPFSCache = (): void => {
  const now = Date.now();
  
  Object.keys(ipfsCache).forEach(key => {
    if (now - ipfsCache[key].timestamp > CACHE_EXPIRY) {
      delete ipfsCache[key];
    }
  });
};

// Run cache cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(cleanIPFSCache, 1000 * 60 * 5);
} 
import { PinataSDK } from "pinata-web3";
import axios from "axios";

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY || "gateway.pinata.cloud",
});
export default pinata;

export async function readImages( ipfsHash:string) {
  try {
    // const data = await pinata.gateways.get("bafybeibikptpzc7iyxggjsngsunzkb25xfyifwogwfbbu36xdw7jpx3gga/appartment2.jpg");
    const data = await pinata.gateways.convert("bafybeibikptpzc7iyxggjsngsunzkb25xfyifwogwfbbu36xdw7jpx3gga/appartment2.jpg");
    // const data = await pinata.groups.get()
// const data = await pinata
//   .listFiles()
//   .cid("bafybeibikptpzc7iyxggjsngsunzkb25xfyifwogwfbbu36xdw7jpx3gga").then((data) => {
//     console.log("files :"+ data)
//     data.map((file) => {
//         console.log("file inti :"+ file);
//     });
//   });
//  await getDirectoryMetadata("bafybeibikptpzc7iyxggjsngsunzkb25xfyifwogwfbbu36xdw7jpx3gga");

    console.log("files :"+ data);

    
    // fetchIPFSData()
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function unpinImaged( ipfsHash:string) {
  try {
   const unpin = await pinata.unpin([
  ipfsHash
])
 

    console.log("files deleted  :"+ unpin);

    
    // fetchIPFSData()
    return unpin;
  } catch (error) {
    console.log(error);
  }
}
interface IPFSResponse {
    data: any;
    status: number;
    error?: string;
}

/**
 * Fetches data from IPFS through Pinata gateway
 * @param cid - The IPFS CID (Content Identifier)
 * @returns Promise<IPFSResponse>
 */
export async function fetchIPFSData(
    cid: string = 'bafybeibikptpzc7iyxggjsngsunzkb25xfyifwogwfbbu36xdw7jpx3gga'
): Promise<IPFSResponse> {
    try {
        // const gateway = 'https://gateway.pinata.cloud/ipfs';
        const gateway = import.meta.env.VITE_PINATA_GATEWAY || 'https://ipfs.io/ipfs';
        const response = await fetch(`${gateway}/${cid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("IPFS JSON Data:", data);
        
        return {
            data,
            status: response.status,
        };
    } catch (error) {
        console.error('Error fetching IPFS data:', error);
        return {
            data: null,
            status: 500,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}

/**
 * Fetches data from IPFS with retry mechanism
 * @param cid - The IPFS CID
 * @param retries - Number of retry attempts
 * @param delay - Delay between retries in milliseconds
 * @returns Promise<IPFSResponse>
 */
export async function fetchIPFSDataWithRetry(
    cid: string = 'bafybeibikptpzc7iyxggjsngsunzkb25xfyifwogwfbbu36xdw7jpx3gga',
    retries: number = 3,
    delay: number = 1000
): Promise<IPFSResponse> {
    for (let i = 0; i < retries; i++) {
        const response = await fetchIPFSData(cid);
        
        if (response.data || i === retries - 1) {
            return response;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    return {
        data: null,
        status: 500,
        error: 'Max retries reached',
    };
}

// Cache mechanism for IPFS data
const ipfsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches IPFS data with caching
 * @param cid - The IPFS CID
 * @returns Promise<IPFSResponse>
 */
export async function fetchIPFSDataWithCache(
    cid: string = 'bafybeibikptpzc7iyxggjsngsunzkb25xfyifwogwfbbu36xdw7jpx3gga'
): Promise<IPFSResponse> {
    const now = Date.now();
    const cached = ipfsCache.get(cid);

    // Return cached data if it exists and hasn't expired
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        return {
            data: cached.data,
            status: 200,
        };
    }

    // Fetch fresh data
    const response = await fetchIPFSDataWithRetry(cid);

    // Cache the new data if fetch was successful
    if (response.data) {
        ipfsCache.set(cid, {
            data: response.data,
            timestamp: now,
        });
    }

    return response;
}
export const getDirectoryMetadata = async (cid) => {
  try {
    const response = await axios.get(
      `https://api.pinata.cloud/data/pinList?hashContains=${cid}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
      }
    );
    return response.data.rows[0]; // Returns metadata for the directory
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw error;
  }
};
// utils/pinata.js (additional function)
// export const uploadDirectory = async (files) => {
//   const formData = new FormData();
//   files.forEach(file => formData.append('file', file));

//   try {
//     const response = await axios.post(
//       'https://api.pinata.cloud/pinning/pinFileToIPFS',
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${ import.meta.env.VITE_PINATA_JWT}`,
//         },
//       }
//     );
//     return response.data.IpfsHash; // Directory CID
//   } catch (error) {
//     console.error('Error uploading directory:', error);
//     throw error;
//   }
// };

// Usage example:
/*
// Basic usage
const fetchData = async () => {
    const response = await fetchIPFSData();
    console.log(response.data);
};

// With retry mechanism
const fetchWithRetry = async () => {
    const response = await fetchIPFSDataWithRetry();
    console.log(response.data);
};

// With caching
const fetchWithCache = async () => {
    const response = await fetchIPFSDataWithCache();
    console.log(response.data);
};
*/
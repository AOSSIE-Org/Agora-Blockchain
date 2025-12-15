import logger from "@/app/helpers/logger";
const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export const pinJSONFile = async (body: any) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      options
    );
    const data = await response.json();
    return data;
  } catch (err) {
    logger.error("pinJSONFile: failed to pin JSON to IPFS", err);
    throw err; // rethrow the error to be handled by the caller
  }
};

export const unpinJSONFile = async (CID: String) => {
  const options = {
    method: "DELETE",
    headers: { Authorization: `Bearer ${JWT}` },
  };

  try {
    await fetch(`https://api.pinata.cloud/pinning/unpin/${CID}`, options);
  } catch (err) {
    logger.error("unpinJSONFile: failed to unpin JSON from IPFS", err);
    throw err; // rethrow the error to be handled by the caller
  }
};

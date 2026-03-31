const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

type PinJSONBody = {
  pinataContent: Record<string, unknown>;
};

type PinJSONResponse = {
  IpfsHash: string;
};

export const pinJSONFile = async (
  body: PinJSONBody
): Promise<PinJSONResponse> => {
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

    if (!response.ok) {
      throw new Error(`Pinata pin request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data?.IpfsHash || typeof data.IpfsHash !== "string") {
      throw new Error("Pinata pin request did not return a valid IpfsHash");
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err; // rethrow the error to be handled by the caller
  }
};

export const unpinJSONFile = async (CID: String) => {
  const options = {
    method: "DELETE",
    headers: { Authorization: `Bearer ${JWT}` },
  };

  try {
    const response = await fetch(
      `https://api.pinata.cloud/pinning/unpin/${CID}`,
      options
    );

    if (!response.ok) {
      throw new Error(
        `Pinata unpin request failed with status ${response.status}`
      );
    }
  } catch (err) {
    console.error(err);
    throw err; // rethrow the error to be handled by the caller
  }
};

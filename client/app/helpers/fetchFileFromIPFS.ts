const GATEWAY = "orange-confused-boar-516.mypinata.cloud";
const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export async function fetchFileFromIPFS(CID: String) {
  const url = `https://${GATEWAY}/ipfs/${CID}`;
  try {
    const request = await fetch(url);
    const response = await request.json();
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const fetchAllGroups = async () => {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${JWT}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch("https://api.pinata.cloud/groups", options);
    const data = await response.json();
    let processedData = data.map((item: any) => item.id);
    return processedData; // Ensure it returns the array
  } catch (err) {
    console.error("Error fetching groups:", err);
    throw err; // rethrow the error to be handled by the caller
  }
};

export async function fetchGroupFiles(id: String) {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${JWT}` },
  };

  try {
    const response = await fetch(
      `https://api.pinata.cloud/data/pinList?groupId=${id}`,
      options
    );
    const data = await response.json();
    let processedData = data.rows
      .filter((item: any) => item.date_unpinned == null) // Filter items with date_unpinned == null
      .map((item: any) => item.ipfs_pin_hash);
    processedData = processedData.reverse();
    return processedData; // Ensure it returns the array
  } catch (err) {
    console.error("Error fetching groups:", err);
    throw err; // rethrow the error to be handled by the caller
  }
}

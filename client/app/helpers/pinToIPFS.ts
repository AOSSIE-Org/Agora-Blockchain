const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export const pinJSONFile = async (body: any, group: String) => {
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
    console.log(data);
    await addCIDtoGroup(group, data.IpfsHash); // Ensure addCIDtoGroup is awaited
    return data;
  } catch (err) {
    console.error(err);
    throw err; // rethrow the error to be handled by the caller
  }
};

export const createGroupIPFS = async (id: Number) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${JWT}`,
      "Content-Type": "application/json",
    },
    body: `{"name":"${id}"}`, // using JSON.stringify for better readability and to handle special characters
  };

  try {
    const response = await fetch("https://api.pinata.cloud/groups", options);
    const data = await response.json();
    console.log("Data : ", data);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const addCIDtoGroup = async (id: String, cid: String) => {
  const options = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cids: [cid],
    }),
  };

  try {
    await fetch(`https://api.pinata.cloud/groups/${id}/cids`, options);
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
    await fetch(`https://api.pinata.cloud/pinning/unpin/${CID}`, options);
  } catch (err) {
    console.error(err);
    throw err; // rethrow the error to be handled by the caller
  }
};

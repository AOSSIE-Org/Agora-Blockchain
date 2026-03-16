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
    console.log(data);
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
    await fetch(`https://api.pinata.cloud/pinning/unpin/${CID}`, options);
  } catch (err) {
    console.error(err);
    throw err; // rethrow the error to be handled by the caller
  }
};

export const pinFileToIPFS = async (file: File) => {
  if (!file) {
    throw new Error("No file provided");
  }

  console.log("Uploading file to IPFS:", file.name);
  
  const formData = new FormData();
  formData.append("file", file);
  
  // Optional metadata
  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      fileType: file.type,
      size: file.size,
      uploadDate: new Date().toISOString()
    }
  });
  formData.append('pinataMetadata', metadata);
  
  // Options for pinning
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    wrapWithDirectory: false
  });
  formData.append('pinataOptions', pinataOptions);

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${JWT}`
    },
    body: formData
  };

  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      options
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    console.log("File upload successful!", data);
    return data; // Contains IpfsHash
  } catch (err) {
    console.error("File upload failed:", err);
    throw err;
  }
};

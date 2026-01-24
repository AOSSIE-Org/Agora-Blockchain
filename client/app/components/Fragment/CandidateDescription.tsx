import { fetchFileFromIPFS } from "@/app/helpers/fetchFileFromIPFS";
import React, { useEffect, useState } from "react";

const CandidateDescription = ({ IpfsHash }: { IpfsHash: String }) => {
  const [ipfsFile, setipfsFile] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  
  const getIpfsFile = async () => {
    try {
      const res = await fetchFileFromIPFS(IpfsHash);
      if (res && typeof res === 'object') {
        setipfsFile(res);
      }
    } catch (err) {
      // Handle error gracefully - set error state but don't crash the component
      setError("Failed to load description");
      console.error("Error fetching candidate description:", err);
    }
  };
  
  useEffect(() => {
    if (ipfsFile.name === "" && !error) {
      getIpfsFile();
    }
  }, []);
  
  if (error) {
    return <p className="text-gray-400 italic">{error}</p>;
  }
  
  return <p>{ipfsFile?.description || ""}</p>;
};

export default CandidateDescription;

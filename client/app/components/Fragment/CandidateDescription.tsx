import { fetchFileFromIPFS } from "@/app/helpers/fetchFileFromIPFS";
import React, { useEffect, useState } from "react";

const CandidateDescription = ({ IpfsHash }: { IpfsHash: String }) => {
  const [ipfsFile, setipfsFile] = useState({
    name: "",
    description: "",
  });
  const getIpfsFile = async () => {
    const res = await fetchFileFromIPFS(IpfsHash);
    setipfsFile(res);
  };
  useEffect(() => {
    ipfsFile.name === "" && getIpfsFile();
  }, []);
  return <p>{ipfsFile?.description}</p>;
};

export default CandidateDescription;

'use client';

import { safeIPFSFetch } from "@/app/helpers/ipfsUtils";
import { FC, useEffect, useState } from "react";

interface CandidateData {
  name: string;
  description: string;
}

interface CandidateDescriptionProps {
  IpfsHash: string;
}

// Inline loading component to avoid import errors
const InlineLoading = ({ size = 'small' }: { size?: 'small' | 'medium' | 'large' }) => {
  const sizeClass = size === 'small' ? 'w-4 h-4' : size === 'medium' ? 'w-8 h-8' : 'w-12 h-12';
  
  return (
    <div className="inline-flex items-center">
      <svg className={`animate-spin ${sizeClass} text-blue-600`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
};

const CandidateDescription: FC<CandidateDescriptionProps> = ({ IpfsHash }) => {
  const [ipfsFile, setIpfsFile] = useState<CandidateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const getIpfsFile = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Use our safe IPFS fetch with fallback
        const defaultData = { name: "Candidate", description: "Description unavailable" };
        const data = await safeIPFSFetch<CandidateData>(IpfsHash, defaultData);
        
        setIpfsFile(data);
      } catch (error) {
        console.error("Failed to fetch candidate description:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getIpfsFile();
  }, [IpfsHash]);

  if (isLoading) {
    return <InlineLoading size="small" />;
  }

  if (hasError) {
    return <p className="text-red-500 italic text-sm">Unable to load candidate information</p>;
  }

  return <p>{ipfsFile?.description || "No description available"}</p>;
};

export default CandidateDescription;

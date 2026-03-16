import { useState, useEffect } from "react";
import { isValidIPFSHash, checkIPFSResource } from "@/app/helpers/fetchFileFromIPFS";

const GATEWAY = "orange-confused-boar-516.mypinata.cloud";

interface CandidateMediaProps {
  mediaURI: string;
  className?: string;
}

const CandidateMedia = ({ mediaURI, className = "" }: CandidateMediaProps) => {
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkMediaType = async () => {
      if (!mediaURI) {
        setError("No media URI provided");
        setLoading(false);
        return;
      }

      if (!isValidIPFSHash(mediaURI)) {
        setError("Invalid IPFS hash");
        setLoading(false);
        return;
      }

      try {
        const exists = await checkIPFSResource(mediaURI);
        if (!exists) {
          setError("Media not found on IPFS");
          setLoading(false);
          return;
        }

        // Check if it's a video by trying to fetch the first few bytes
        const response = await fetch(`https://${GATEWAY}/ipfs/${mediaURI}`);
        const contentType = response.headers.get("content-type");
        
        if (contentType?.startsWith("video/")) {
          setMediaType("video");
        } else if (contentType?.startsWith("image/")) {
          setMediaType("image");
        } else {
          setError("Unsupported media type");
        }
      } catch (err) {
        setError("Failed to load media");
        console.error("Error checking media type:", err);
      } finally {
        setLoading(false);
      }
    };

    checkMediaType();
  }, [mediaURI]);

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}>
        <div className="w-full h-48"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!mediaType) {
    return null;
  }

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      {mediaType === "image" ? (
        <img
          src={`https://${GATEWAY}/ipfs/${mediaURI}`}
          alt="Candidate media"
          className="w-full h-full object-cover"
          onError={() => setError("Failed to load image")}
        />
      ) : (
        <video
          src={`https://${GATEWAY}/ipfs/${mediaURI}`}
          controls
          className="w-full h-full object-cover"
          onError={() => setError("Failed to load video")}
        />
      )}
    </div>
  );
};

export default CandidateMedia; 
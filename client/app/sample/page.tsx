"use client";

import { useState } from "react";
import { pinata } from "@/utils/config";

export default function Home() {
	const [file, setFile] = useState<File>();
	const [url, setUrl] = useState("");
	const [uploading, setUploading] = useState(false);

	const uploadFile = async () => {
		if (!file) {
			alert("No file selected");
			return;
		}

		try {
			setUploading(true);
			const keyRequest = await fetch("/api/key");
			const keyData = await keyRequest.json();
			const upload = await pinata.upload.file(file).key(keyData.JWT);
            const url = `https://ipfs.io/ipfs/${upload.IpfsHash}`;
			setUrl(url);
			setUploading(false);
		} catch (e) {
			console.log(e);
			setUploading(false);
			alert("Trouble uploading file");
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFile(e.target?.files?.[0]);
	};

	return (
		<main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
			<input type="file" onChange={handleChange} />
			<button type="button" disabled={uploading} onClick={uploadFile}>
				{uploading ? "Uploading..." : "Upload"}
			</button>
			{url && <img src={url} alt="Image from Pinata" />}
		</main>
	);
}
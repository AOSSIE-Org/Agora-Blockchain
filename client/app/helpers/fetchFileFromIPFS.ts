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

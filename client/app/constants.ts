export const ELECTION_FACTORY_ADDRESS = 
  process.env.NODE_ENV === "development"
    ? "0x5FbDB2315678afecb367f032d93F642f64180aa3" // Local Hardhat Address
    : "0x64c720eBD5227bba57a5E8282893e71087cCcBb8"; // Production Sepolia Address

export const CCIP_FUJI_ADDRESS = "0xca2d3fc837b349caf17cbd965856fc33120b1c0f";
export const SEPOLIA_CHAIN_SELECTOR = BigInt("16015286601757825753");
export const LINK_FUJI = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846";
export const AVATARS = [
  "/avatar0.png",
  "/avatar1.png",
  "/avatar2.png",
  "/avatar3.png",
];
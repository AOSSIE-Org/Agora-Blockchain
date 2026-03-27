// Retrieve and parse the allowed issuers from environment variables
const allowedIssuersEnv = process.env.ALLOWED_ISSUERS || "";
const allowedIssuers = allowedIssuersEnv.split(',').filter(Boolean); // Splits by comma and removes any empty strings

if (allowedIssuers.length === 0) {
  console.warn(`
    WARNING: The ALLOWED_ISSUERS environment variable is not set or is empty.
    This means that no issuers will be trusted for KYC credentials.
    Please set this variable to a comma-separated list of trusted issuer DIDs.
    e.g., ALLOWED_ISSUERS=did:polygonid:polygon:mumbai:...,did:polygonid:polygon:mumbai:...
  `);
}

module.exports = {
  // VC type: KYCAgeCredential
  // https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld
  KYCAgeCredential: (credentialSubject) => ({
    id: 1,
    circuitId: "credentialAtomicQuerySigV2",
    query: {
      // The allowedIssuers array is now populated from the ALLOWED_ISSUERS environment variable
      allowedIssuers: allowedIssuers,
      type: "KYCAgeCredential",
      context:
        "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld",
      credentialSubject,
    },
  }),
};
  // See more off-chain examples
  // https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/#equals-operator-1

# Polygon ID VC Verifier Server

This repo contains the server code you'll need to set up a VC (Verifiable Credential) gated website with Polygon ID. Complete local server setup below, then hook this verification server up to a frontend so you can limit access based on holding a VC that satisifies your requirements.

## Server functionality

- Allows [Socket.io polling](https://socket.io/docs/v3/how-it-works/) to emit session specific events back to connected clients

- Generates a [Query Based Request](https://0xpolygonid.github.io/tutorials/verifier/verification-library/request-api-guide/#query-based-request) in the form of a QR code that the user can scan to prove they own a credential that satisfies certain requirements. It also specifies the callback endpoint for verification

- Reports [Verification](https://0xpolygonid.github.io/tutorials/verifier/verification-library/verification-api-guide/) of the proof sent by the user from their Polygon ID Wallet via callback

## Local server setup

#### 1. Install server dependencies

```bash
cd server
npm i
```

#### 2. Create a .env file by copying my sample

In your .env file,

```bash
cp .env.sample .env;
```

- Update the `RPC_URL_MUMBAI` to a Polygon Mumbai RPC endpoint. I used [Alchemy's](https://alchemy.com/?r=zU2MTQwNTU5Mzc2M)
- Optionally update the `VERIFIER_DID` to your DID
- Don't change `HOSTED_SERVER_URL` or `FRONTEND_URL` yet

#### 3. Run your server on port 8080

```bash
npm start
```

#### 4. Set up ngrok server forwarding (required!)

If you don't have ngrok already set up, install [ngrok](https://ngrok.com/download) via homebrew or download. [Login](https://dashboard.ngrok.com/login) (I used github login) to create a free account and add your account's config token to the command line.

After ngrok is set up, start a tunnel to port 8080 to expose your server to the internet beyond only being available to your laptop on localhost:8080. **This is necessary because the Polygon ID mobile wallet app will use a verfication uri you provide and needs to be able to send the verification result to this exposed public endpoint.**

```bash
ngrok http 8080
```

You'll see a forwarding address in the logs

```bash
Forwarding  https://abc-your-forwarding-address-def.ngrok-free.app -> http://localhost:8080
```

#### 5. Update the `HOSTED_SERVER_URL` field your .env file to your forwarding address

```bash
HOSTED_SERVER_URL="https://abc-your-forwarding-address-def.ngrok-free.app"
```

#### 6. Optionally customize your own proof request by changing the credentialSubject in [`proofRequest.js`](https://github.com/oceans404/vc-verifier/blob/main/proofRequest.js)

ex 1: User must have Taylor Swift's [exact](https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/#equals-operator-1) birthday - December 13, 1989

```js
{
  birthday: {
    $eq: 19891213,
  },
};

```

ex 2: User's KYCAgeCredential documentType must be [greater than](https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/#greater-than-operator-3) 420

```js
{
  documentType: {
    $gt: 420,
  },
};

```

**default: [proofRequest](https://github.com/oceans404/vc-verifier/blob/main/proofRequest.js#L8)**

If you don't customize `proofRequest.js`, this server will send a verification request for an KYCAgeCredential proof with a birthday before January 1, 2023 to the [credentialAtomicQuerySigV2 circuit](https://docs.iden3.io/protocol/main-circuits/#credentialatomicquerysigv2). This circuit is specified by the circuitId in `vcHelpers/KYCAgeCredential.js`, set to credentialAtomicQuerySigV2.

```js
{
  birthday: {
    // users must be born before this year
    // birthday is less than Jan 1, 2023
    $lt: 20230101,
  },
};

```

<img width="162" alt="proof" src="https://github.com/oceans404/vc-verifier/assets/91382964/ab18d8a6-ca14-4503-b7cf-c4bac8ccd869">

The credentialAtomicQuerySigV2 circuit

- Verifies that the prover (your user) is owner of a VC with the KYCAgeCredential type
- Verifies that the identity is the subject of the claim
- Verifies that the claim was signed by the issuer
- Verifies that the claim schema matches the one in the query
- Verifies that the claim is not revoked by the issuer and is not expired
- Verifies that the query posed by the verifier is satisfied by the claim. The check, `$lt: 20230101`, written in [Query Language](https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/) verifies that the `birthday` credentialSubject is less than 20230101 or that the user's birthday is before Jan 1, 2023. In human terms, the user "Must be born before this year."

If all these are satisfied by the verifier, an authResponse with fields for did_doc and scope containing the valid proof will be returned via the handleVerification callback function. 🎉

#### 7. Hosting the server (optional)

You are currently running the server on localhost and forwarding to [ngrok](https://github.com/oceans404/vc-verifier/blob/main/.env.sample#L1) to exposse it to the internet.

If you'd like to host the server, you can use something like [Render](https://render.com/), [documented by me here](https://github.com/oceans404/vc-verifier/blob/main/.env.sample#L1). Connect your repo, then make sure to add all your environment variables from .env. Update the HOSTED_SERVER_URL environment variable to match the server domain created by Render. Mine is https://vc-birthday-server.onrender.com

<img width="1265" alt="Screenshot 2023-06-06 at 11 11 06 AM" src="https://github.com/oceans404/vc-verifier/assets/91382964/dff0176b-1bb2-4c1f-b97c-7c2b50c03737">

Note: You'll run into CORS errors if you try to hit the server from any frontend other than the one matching the [FRONTEND_URL](https://github.com/oceans404/vc-verifier/blob/main/.env.sample#L4) environment variable you set. For example, once you host your frontend using Vercel or Fleek, and you're no longer connecting from localhost:8080, you'll have to update the FRONTEND_URL variable on Render to match.

https://github.com/oceans404/vc-verifier/blob/main/.env.sample#L1

#### 8. Hook the server up to a frontend

This repo covers server setup. Next hook the server up to a frontend using this code:

- frontend github repo: https://github.com/oceans404/vc-gated-website
- hosted frontend website: https://birthday-gated-website.on.fleek.co
- additional instructions on how to get a KYCAgeCredential Verifiable Credential and interact with the frontend: https://www.notion.so/oceans404/How-to-get-a-KYCAgeCredential-Verifiable-Credential-f3d34e7c98ec4147b6b2fae79066c4f6?pvs=4

# More info

## Keys folder

The keys folder holds the authV2, credentialAtomicQueryMTPV2, and credentialAtomicQuerySigV2 public verification keys necessary to verify a zero-knowledge proof. You can optionally verify these keys by following instructions [here](https://github.com/0xPolygonID/phase2ceremony)

Here's the corresponding Iden3 circuit code

- [authV2.circom](https://github.com/iden3/circuits/blob/master/circuits/auth/authV2.circom)
- [credentialAtomicQueryMTPOffChain.circom](https://github.com/iden3/circuits/blob/master/circuits/offchain/credentialAtomicQueryMTPOffChain.circom)
- [credentialAtomicQuerySigOffChain.circom](https://github.com/iden3/circuits/blob/master/circuits/offchain/credentialAtomicQuerySigOffChain.circom)

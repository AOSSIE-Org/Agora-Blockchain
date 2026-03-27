# Smoke Test Checklist

Use this checklist after changes related to route gating, registration persistence, IPFS proxying, or election detail page state sync.

## Scope

- Anonymous voting app registration persistence in Redux
- Logout/reset behavior for persisted registration state
- Next.js IPFS API proxy response passthrough and input validation
- Election page shared-store synchronization and cleanup behavior

## Prerequisites

- Run the anonymous voting client:
  - `cd anonymousVoting/clientAnonymousVoting`
  - `npm install`
  - `npm start`
- Run the Next.js client:
  - `cd client`
  - `npm install`
  - `npm run dev`
- Configure required env vars for each app before testing.

## 1. Registration Persistence On Refresh (anonymousVoting)

1. Open the anonymous voting app in a browser.
2. Complete registration so `hasRegistered` becomes `true`.
3. Navigate to a route that requires registered state (for example dashboard/create process/voting).
4. Refresh the page.

Expected:

- The app still treats the user as registered after refresh.
- Registered route tree remains accessible.
- App is not redirected to the unregistered default flow.

## 2. Logout/Reset Clears Persisted Flag (anonymousVoting)

1. Start from a registered state.
2. Trigger logout from the UI (navbar logout icon).
3. Confirm route behavior now matches unregistered state.
4. Refresh the page.

Expected:

- `hasRegistered` is reset to `false`.
- Unregistered route tree is used after logout.
- Refresh does not restore previous registered access.

## 3. IPFS POST Proxy Passthrough (client)

1. Trigger a successful pin flow that calls `POST /api/ipfs`.
2. Confirm response is returned successfully to the caller.
3. Trigger an upstream error (for example malformed payload).

Expected:

- Success response remains unchanged and parseable.
- On upstream failure, status code from Pinata is preserved.
- Body is preserved (JSON when parseable, plain text otherwise).
- Missing `X-Internal-API-Key` from browser request does not cause local 401.

## 4. IPFS DELETE CID Validation and Safety (client)

1. Call `DELETE /api/ipfs` with invalid inputs:
   - `cid: ""`
   - `cid: "   "`
   - `cid` as non-string
2. Call `DELETE /api/ipfs` with a valid CID.

Expected:

- Invalid input returns HTTP 400 with a JSON error.
- Valid CID path uses normalized and URL-encoded CID.
- On upstream failure, status/body are proxied instead of collapsed into a generic local 500.

## 5. Election Page Refresh and Context Change Behavior (client)

1. Open `client/app/election/[id]` page for one election.
2. Wait for full details render.
3. Refresh the page multiple times.
4. Navigate to a different election id.
5. Switch wallet account and reload election data.

Expected:

- Shared election data is not cleared on every refresh update.
- Data remains stable after refresh and resolves correctly.
- Store cleanup runs when election id or wallet context changes (or on unmount), preventing stale carryover.

## Quick Pass Criteria

- All five sections meet expected outcomes.
- No unexpected redirects/regressions in route access.
- No local 500 caused by upstream non-JSON bodies in IPFS proxy.
- No stale election details after changing wallet/election context.

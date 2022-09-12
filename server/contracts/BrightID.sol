// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

contract BrightID {
    address[] public verifiedUsers;

    //BrightID
    bytes32 app = "snapshot";
    address authorizedSigners = 0xb1d71F62bEe34E9Fc349234C201090c33BCdF6DB;

    function verify(
        address[] memory addrs,
        uint256 timestamp,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        bytes32 message = keccak256(abi.encodePacked(app, addrs, timestamp));
        address signer = ecrecover(message, v, r, s);
        require(signer == authorizedSigners, "Not authorized");
        verifiedUsers.push(addrs[0]);
    }

    function getVerifiers() public view returns (address[] memory) {
        return verifiedUsers;
    }
}

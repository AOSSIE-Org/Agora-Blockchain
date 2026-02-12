// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Client} from '@chainlink/contracts-ccip/contracts/libraries/Client.sol';
import {ElectionFactory} from '../ElectionFactory.sol';

contract MockCCIPReceiverRouter {
  ElectionFactory electionFactory;

  constructor(address _electionFactory) {
    electionFactory = ElectionFactory(_electionFactory);
  }

  function sendMessage(
    bytes32 _messageId,
    address _user,
    address _sender,
    address _election,
    uint64 _sourceChainSelector,
    uint[] calldata _voteArr
  ) public {
    ElectionFactory.CCIPVote memory vote = ElectionFactory.CCIPVote({
      election: _election,
      user: _user,
      voteArr: _voteArr
    });

    bytes memory encodedVote = abi.encode(vote);
    Client.Any2EVMMessage memory message = Client.Any2EVMMessage({
      messageId: _messageId,
      sourceChainSelector: _sourceChainSelector,
      sender: abi.encode(_sender),
      data: encodedVote,
      destTokenAmounts: new Client.EVMTokenAmount[](0)
    });

    bytes4 selector = bytes4(
      keccak256('ccipReceive((bytes32,uint64,bytes,bytes,(address,uint256)[]))')
    );
    bytes memory callData = abi.encodeWithSelector(selector, message);
    (bool success, bytes memory returnData) = address(electionFactory).call(
      callData
    );
    // require(success, "low level function call failed ");
    if (!success) {
      if (returnData.length > 0) {
        // Decode and revert with the actual error message
        assembly {
          let returndata_size := mload(returnData)
          revert(add(32, returnData), returndata_size)
        }
      } else {
        revert('Low-level call failed without reason');
      }
    }
  }
}

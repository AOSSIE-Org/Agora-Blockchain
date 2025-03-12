// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {ElectionFactory} from "../ElectionFactory.sol";

contract MockCCIPSender {
    ElectionFactory electionFactory ; 

    constructor(address _electionFactory){
        electionFactory = ElectionFactory(_electionFactory);
    }

    function sendMessage(
        address _user , 
        bytes32 _messageId , 
        address _sender , 
        address _election ,
        uint64 _sourceChainSelector , 
        uint[] calldata _voteArr
    ) public {
        ElectionFactory.CCIPVote memory  vote =  ElectionFactory.CCIPVote({
            election:_election, 
            user:_user , 
            voteArr:_voteArr
            
        });

        bytes memory encodedVote = abi.encode(vote);
        Client.Any2EVMMessage memory message = Client.Any2EVMMessage({
            messageId:_messageId, 
            sourceChainSelector: _sourceChainSelector,
            sender:abi.encode(_sender), 
            data:encodedVote, 
            destTokenAmounts: new Client.EVMTokenAmount[](0)

        });


         (bool success , ) = address(electionFactory).call(abi.encodeWithSignature("_ccipReceive((bytes32,uint64,bytes,bytes,(address,uint256)[]))",message ));
        require(success, "low level function call failed ");


    }
}
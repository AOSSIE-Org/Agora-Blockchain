// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

contract CCIPSender is OwnerIsCreator {
    // Used to make sure contract has enough balance
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error CCIPNotSupported();
    error InsufficientAllowance();
    struct CCIPVote {
        address election;
        address user;
        uint[] voteArr;
    }

    // Event emitted when a message is sent to another chain.
    event MessageSent(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        string text, // The text being sent.
        address feeToken, // the token address used to pay CCIP fees.
        uint256 fees // The fees paid for sending the CCIP message.
    );

    IRouterClient private s_router;
    address private electionFactory;
    LinkTokenInterface private s_linkToken;
    uint public constant minTokens = 25000000000000000000;
    mapping(address election => bool status) public electionApproved;

    /// @notice Constructor initializes the contract with the router address.
    constructor(address _router, address _link, address _electionFactory) {
        s_router = IRouterClient(_router);
        s_linkToken = LinkTokenInterface(_link);
        electionFactory = _electionFactory;
    }

    function getLinkBalance() external view returns (uint) {
        return s_linkToken.balanceOf(address(this));
    }

    function updateElectionFactory(
        address _newElectionFactory
    ) external onlyOwner {
        electionFactory = _newElectionFactory;
    }

    function addElection(address _election) external {
        uint256 allowance = s_linkToken.allowance(msg.sender, address(this));
        if (allowance < minTokens) revert InsufficientAllowance();
        s_linkToken.transferFrom(msg.sender, address(this), minTokens);
        electionApproved[_election] = true;
    }

    function sendMessage(
        uint64 destinationChainSelector,
        address _election,
        uint[] calldata _voteArr
    ) external returns (bytes32 messageId) {
        if (!electionApproved[_election]) {
            revert CCIPNotSupported();
        }
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        CCIPVote memory _voteDetails = CCIPVote(
            _election,
            msg.sender,
            _voteArr
        );
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(electionFactory),
            data: abi.encode(_voteDetails), // ABI-encoded vote
            tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array indicating no tokens are being sent
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 200_000})
            ),
            feeToken: address(s_linkToken)
        });

        uint256 fees = s_router.getFee(
            destinationChainSelector,
            evm2AnyMessage
        );

        if (fees > s_linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);

        s_linkToken.approve(address(s_router), fees);

        messageId = s_router.ccipSend(destinationChainSelector, evm2AnyMessage);

        emit MessageSent(
            messageId,
            destinationChainSelector,
            electionFactory,
            "Voted",
            address(s_linkToken),
            fees
        );

        return messageId;
    }
}
